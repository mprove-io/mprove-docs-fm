import {
  type FileObject,
  printErrors,
  scanURLs,
  validateFiles,
} from 'next-validate-link';
import { isMcpMdxPageData, mcpDocsSource } from '@/lib/mcp-source';
import {
  cliSource,
  docsSource,
  isMdxPageData,
  skillsSource
} from '@/lib/source';

const pageSources = [
  {
    route: 'content/docs/[[...slug]]',
    source: docsSource
  },
  {
    route: 'content/cli/[[...slug]]',
    source: cliSource
  },
  {
    route: 'content/skills/[[...slug]]',
    source: skillsSource
  },
  {
    route: 'content/mcp/[[...slug]]',
    source: mcpDocsSource
  }
];

async function checkLinks() {
  const scanned = await scanURLs({
    // pick a preset for your React framework
    preset: 'next',
    populate: Object.fromEntries(
      pageSources.map(({ route, source }) => [
        route,
        source.getPages().map(page => ({
          value: {
            slug: page.slugs
          },
          hashes: getHeadings(page)
        }))
      ])
    )
  });

  printErrors(
    await validateFiles(await getFiles(), {
      scanned,
      // check `href` attributes in different MDX components
      markdown: {
        components: {
          Card: { attributes: ['href'] },
        },
      },
      // check relative paths
      checkRelativePaths: 'as-url',
    }),
    true
  );
}

function getHeadings({ data }: { data: unknown }): string[] {
  if (!isLinkCheckableMdxPageData(data)) {
    return [];
  }

  if (!data.toc) {
    return [];
  }

  return data.toc.map(item => item.url.slice(1));
}

function getFiles() {
  const promises = pageSources.flatMap(({ source }) =>
    source.getPages().map(async (page): Promise<FileObject | null> => {
      if (!page.absolutePath || !isLinkCheckableMdxPageData(page.data)) {
        return null;
      }

      return {
        path: page.absolutePath,
        content: await page.data.getText('raw'),
        url: page.url,
        data: page.data
      };
    })
  );

  return Promise.all(promises).then((files) =>
    files.filter((file): file is FileObject => file !== null)
  );
}

type LinkCheckableMdxPageData = {
  getText: (format: 'raw') => Promise<string>;
  toc?: Array<{ url: string }>;
};

function isLinkCheckableMdxPageData(
  data: unknown
): data is LinkCheckableMdxPageData {
  return isMdxPageData(data) || isMcpMdxPageData(data);
}

void checkLinks();
