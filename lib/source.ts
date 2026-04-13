import { cli, docs } from 'collections/server';
import {
  type InferPageType,
  type LoaderOutput,
  loader,
  type Source,
  update
} from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { openapiPlugin, openapiSource } from 'fumadocs-openapi/server';
import { openapi } from '@/lib/openapi';

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
type OpenAPISource = Awaited<ReturnType<typeof openapiSource>>;
type OpenAPIPageData =
  OpenAPISource extends Source<infer Config> ? Config['pageData'] : never;
type OpenAPIMetaData =
  OpenAPISource extends Source<infer Config> ? Config['metaData'] : never;

const openapiPages = openapi
  ? update(
      await openapiSource(openapi, {
        baseDir: 'openapi',
        meta: true,
        groupBy: 'tag'
      })
    )
      .meta(meta => {
        if (meta.path !== 'openapi/meta.json') return meta;

        return {
          ...meta,
          data: {
            ...meta.data,
            title: 'OpenAPI',
            root: true
          }
        };
      })
      .build()
  : null;

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

export const openapiSourceLoader = openapiPages
  ? (loader({
      baseUrl: '/content/openapi',
      source: openapiPages as Source<{
        pageData: OpenAPIPageData;
        metaData: OpenAPIMetaData;
      }>,
      plugins: [lucideIconsPlugin(), openapiPlugin()]
    }) as LoaderOutput<{
      source: {
        pageData: OpenAPIPageData;
        metaData: OpenAPIMetaData;
      };
      i18n: undefined;
    }>)
  : null;

export const source = docsSource;
export const docsTree = docsSource.pageTree;
export const cliTree = cliSource.pageTree;
export const openapiTree = openapiSourceLoader?.pageTree;

export const openapiEnabled = Boolean(openapiSourceLoader);
export const firstOpenAPIPage = openapiSourceLoader
  ?.getPages()
  .find(
    page =>
      typeof page.data === 'object' &&
      page.data !== null &&
      'getAPIPageProps' in page.data
  )?.url;
export const firstCliPage = cliSource.getPages().at(0)?.url;

export function isOpenAPIPageData(data: unknown): data is OpenAPIPageData {
  return typeof data === 'object' && data !== null && 'getAPIPageProps' in data;
}

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

  let content: string;

  try {
    content = await page.data.getText('processed');
  } catch {
    content = await page.data.getText('raw');
  }

  return `# ${page.data.title}

${content}`;
}
