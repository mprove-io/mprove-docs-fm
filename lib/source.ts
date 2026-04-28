import fs from 'node:fs/promises';
import path from 'node:path';
import { cli, docs } from 'collections/server';
import {
  type InferPageType,
  type LoaderOutput,
  loader,
  type Source
} from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';

const docsContentSource = docs.toFumadocsSource();
const cliContentSource = cli.toFumadocsSource();

type DocsContentSource = typeof docsContentSource;
type CliContentSource = typeof cliContentSource;
type DocsPageData =
  DocsContentSource extends Source<infer Config> ? Config['pageData'] : never;
type DocsMetaData =
  DocsContentSource extends Source<infer Config> ? Config['metaData'] : never;
type CliPageData =
  CliContentSource extends Source<infer Config> ? Config['pageData'] : never;
type CliMetaData =
  CliContentSource extends Source<infer Config> ? Config['metaData'] : never;

export const docsSource = loader({
  baseUrl: '/content/docs',
  source: docsContentSource as Source<{
    pageData: DocsPageData;
    metaData: DocsMetaData;
  }>,
  plugins: [lucideIconsPlugin()]
}) as LoaderOutput<{
  source: {
    pageData: DocsPageData;
    metaData: DocsMetaData;
  };
  i18n: undefined;
}>;

export const cliSource = loader({
  baseUrl: '/content/cli',
  source: cliContentSource as Source<{
    pageData: CliPageData;
    metaData: CliMetaData;
  }>,
  plugins: [lucideIconsPlugin()]
}) as LoaderOutput<{
  source: {
    pageData: CliPageData;
    metaData: CliMetaData;
  };
  i18n: undefined;
}>;

export const source = docsSource;
export const docsTree = docsSource.pageTree;
export const cliTree = cliSource.pageTree;

export const firstCliPage = cliSource.getPages().at(0)?.url;

export function isMdxPageData(data: unknown): data is DocsPageData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'body' in data &&
    'getText' in data
  );
}

export async function getLLMText(page: InferPageType<typeof docsSource>) {
  if (!isMdxPageData(page.data)) {
    return '# Documentation';
  }

  const raw = await page.data.getText('raw');
  const content = await expandDynamicCodeBlocks(raw);

  return stripFrontmatter(content);
}

const importRegex =
  /^import\s+\{\s*(?<name>\w+)\s*\}\s+from\s+["']@\/content\/docs\/parts\/(?<file>[^"']+)["'];?\s*$/gm;
const dynamicCodeBlockRegex = /<DynamicCodeBlock\b(?<attrs>[\s\S]*?)\/>/g;

async function expandDynamicCodeBlocks(content: string): Promise<string> {
  const codeByName = new Map<string, string>();

  for (const match of content.matchAll(importRegex)) {
    const name = match.groups?.name;
    const file = match.groups?.file;
    if (!name || !file) continue;

    const code = await readExportedTemplateLiteral(
      path.join(process.cwd(), 'content/docs/parts', `${file}.ts`),
      name
    );

    if (code !== undefined) codeByName.set(name, code);
  }

  return content
    .replace(importRegex, '')
    .replace(
      /^import\s+\{\s*DynamicCodeBlock\s*\}\s+from\s+["']@\/components\/dynamic-codeblock["'];?\s*$/gm,
      ''
    )
    .replace(dynamicCodeBlockRegex, (value, attrs: string) => {
      const codeName = attrs.match(/\bcode=\{(?<name>\w+)\}/)?.groups?.name;
      if (!codeName) return value;

      const code = codeByName.get(codeName);
      if (code === undefined) return value;

      const lang =
        attrs.match(/\blang=["'](?<lang>[^"']+)["']/)?.groups?.lang ?? 'txt';

      return `\`\`\`${lang}\n${code.trimEnd()}\n\`\`\``;
    })
    .replace(/\n{3,}/g, '\n\n');
}

async function readExportedTemplateLiteral(
  filePath: string,
  name: string
): Promise<string | undefined> {
  const source = await fs.readFile(filePath, 'utf8');
  const marker = `export const ${name} = \``;
  const start = source.indexOf(marker);
  if (start === -1) return undefined;

  let index = start + marker.length;
  let output = '';

  while (index < source.length) {
    const char = source[index];

    if (char === '`' && source[index - 1] !== '\\') return output;
    output += char;
    index++;
  }
}

function stripFrontmatter(content: string): string {
  return content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '').trimStart();
}
