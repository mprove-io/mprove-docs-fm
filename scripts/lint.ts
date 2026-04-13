import {
  type FileObject,
  printErrors,
  scanURLs,
  validateFiles,
} from 'next-validate-link';
import type { InferPageType } from 'fumadocs-core/source';
import { isMdxPageData, source } from '@/lib/source';

async function checkLinks() {
  const scanned = await scanURLs({
    // pick a preset for your React framework
    preset: 'next',
    populate: {
      'docs/[[...slug]]': source.getPages().map((page) => {
        return {
          value: {
            slug: page.slugs,
          },
          hashes: getHeadings(page),
        };
      }),
    },
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
    true,
  );
}

function getHeadings({ data }: InferPageType<typeof source>): string[] {
  if (!isMdxPageData(data)) {
    return [];
  }

  if (!data.toc) {
    return []; 
  }

  return data.toc.map((item: { url: string }) => item.url.slice(1));
}

function getFiles() {
  const promises = source.getPages().map(
    async (page): Promise<FileObject | null> => {
      if (!page.absolutePath || !isMdxPageData(page.data)) {
        return null;
      }

      return {
        path: page.absolutePath,
        content: await page.data.getText('raw'),
        url: page.url,
        data: page.data,
      };
    },
  );

  return Promise.all(promises).then((files) =>
    files.filter((file): file is FileObject => file !== null),
  );
}

void checkLinks();
