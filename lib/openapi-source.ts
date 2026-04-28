import {
  type LoaderOutput,
  loader,
  type Source,
  update
} from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { openapiPlugin, openapiSource } from 'fumadocs-openapi/server';
import { openapi, openapiDocument } from '@/lib/openapi';
import {
  getOpenAPIOperationFileEntries,
  type OpenAPIOperationFileEntry
} from '@/lib/openapi-operation-files';
import { OPENAPI_TAG_GROUPS } from '@/lib/openapi-tag-groups';

type OpenAPISource = Awaited<ReturnType<typeof openapiSource>>;
type OpenAPIPageData =
  OpenAPISource extends Source<infer Config> ? Config['pageData'] : never;
type OpenAPIMetaData =
  OpenAPISource extends Source<infer Config> ? Config['metaData'] : never;
type OpenAPIByPathPageData = {
  title: string;
  description: string;
  _openapiByPath: true;
};
type OpenAPILoaderPageData = OpenAPIPageData | OpenAPIByPathPageData;
type OpenAPIVirtualFile = OpenAPISource['files'][number];
type OpenAPIVirtualPage = Extract<OpenAPIVirtualFile, { type: 'page' }>;
type OpenAPIVirtualMeta = Extract<OpenAPIVirtualFile, { type: 'meta' }>;
type OpenAPIByPathVirtualPage = {
  type: 'page';
  path: string;
  data: OpenAPIByPathPageData;
};
export type OpenAPIByPathSection = {
  title: string;
  links: OpenAPIOperationFileEntry[];
};

const OPENAPI_BASE_DIR: string = '';
const OPENAPI_BY_PATH_SLUG = 'openapi-by-path';
const DEFAULT_OPENAPI_PAGE = '/content/openapi/data/state/GetStateController';
export const openapiOperationFileEntries = openapi
  ? getOpenAPIOperationFileEntries(openapiDocument)
  : [];
export const openapiOperationFileHrefByKey = new Map(
  openapiOperationFileEntries.map(entry => [entry.key, entry.href])
);
export const openapiByPathSections = groupOpenAPIEntriesByPath(
  openapiOperationFileEntries
);

const openapiTagGroupByTag = (() => {
  const output = new Map<string, string>();

  for (const group of OPENAPI_TAG_GROUPS) {
    for (const tag of group.tags) {
      const normalizedTag = normalizeTagKey(tag);

      if (output.has(normalizedTag)) {
        throw new Error(`OpenAPI tag "${tag}" is assigned to multiple groups.`);
      }

      output.set(normalizedTag, group.name);
    }
  }

  return output;
})();

const openapiConfiguredTagByNormalizedTag = (() => {
  const output = new Map<string, string>();

  for (const group of OPENAPI_TAG_GROUPS) {
    for (const tag of group.tags) {
      output.set(normalizeTagKey(tag), tag);
    }
  }

  return output;
})();

function slugifySegment(value: string): string {
  return value.replace(/\s+/g, '-').toLowerCase();
}

function normalizeTagKey(value: string): string {
  return value.replace(/[^a-z0-9]/gi, '').toLowerCase();
}

function groupOpenAPIEntriesByPath(
  entries: OpenAPIOperationFileEntry[]
): OpenAPIByPathSection[] {
  const entriesByTag = new Map<string, OpenAPIOperationFileEntry[]>();
  const assignedEntries = new Set<OpenAPIOperationFileEntry>();

  for (const entry of entries) {
    const tag = entry.tags[0] ?? 'unknown';
    const normalizedTag = normalizeTagKey(tag);

    entriesByTag.set(normalizedTag, [
      ...(entriesByTag.get(normalizedTag) ?? []),
      entry
    ]);
  }

  const sections: OpenAPIByPathSection[] = [];

  for (const group of OPENAPI_TAG_GROUPS) {
    for (const tag of group.tags) {
      const links = entriesByTag.get(normalizeTagKey(tag));
      if (!links?.length) continue;

      for (const link of links) assignedEntries.add(link);

      sections.push({
        title: tag,
        links: sortOpenAPIEntries(links)
      });
    }
  }

  const otherLinks = entries.filter(entry => !assignedEntries.has(entry));
  if (otherLinks.length > 0) {
    sections.push({
      title: 'Other',
      links: sortOpenAPIEntries(otherLinks)
    });
  }

  return sections;
}

function sortOpenAPIEntries(entries: OpenAPIOperationFileEntry[]) {
  return [...entries].sort(
    (first, second) =>
      first.path.localeCompare(second.path) ||
      first.method.localeCompare(second.method)
  );
}

function withOpenAPIBaseDir(path: string): string {
  return OPENAPI_BASE_DIR ? `${OPENAPI_BASE_DIR}/${path}` : path;
}

function stripOpenAPIBaseDir(path: string): string {
  const normalizedPath = path.replace(/^\/+/, '');

  return OPENAPI_BASE_DIR
    ? normalizedPath.slice(OPENAPI_BASE_DIR.length + 1)
    : normalizedPath;
}

const openapiPages = openapi
  ? await (async () => {
      const [tagPagesSource, operationPagesSource] = await Promise.all([
        openapiSource(openapi, {
          baseDir: OPENAPI_BASE_DIR,
          per: 'tag'
        }),
        openapiSource(openapi, {
          baseDir: OPENAPI_BASE_DIR,
          meta: true,
          groupBy: 'tag'
        })
      ]);

      const tagPages = new Map<
        string,
        {
          slug: string;
          page: OpenAPIVirtualPage;
        }
      >();
      const tagTitlesBySlug = new Map<string, string>();

      for (const file of tagPagesSource.files) {
        if (file.type !== 'page') continue;

        const title =
          typeof file.data.title === 'string' ? file.data.title : undefined;
        if (!title) continue;
        const configuredTitle =
          openapiConfiguredTagByNormalizedTag.get(normalizeTagKey(title)) ??
          title;

        const slug = stripOpenAPIBaseDir(file.path).slice(0, -4);
        const page: OpenAPIVirtualPage = {
          ...file,
          data: {
            ...file.data,
            title: configuredTitle
          }
        };

        tagPages.set(configuredTitle, {
          slug,
          page
        });
        tagTitlesBySlug.set(slug, configuredTitle);
      }

      return update(operationPagesSource)
        .files<OpenAPILoaderPageData, OpenAPIMetaData>(files => {
          const rootPages: string[] = [];
          const nextFiles: Array<
            OpenAPIVirtualFile | OpenAPIByPathVirtualPage
          > = [];

          for (const group of OPENAPI_TAG_GROUPS) {
            const groupedTagPaths: string[] = [];

            for (const tag of group.tags) {
              const tagPage = tagPages.get(tag);
              const groupSlug = slugifySegment(group.name);

              if (!tagPage) {
                const fallbackTagPage = Array.from(tagPages.entries()).find(
                  ([title]) => normalizeTagKey(title) === normalizeTagKey(tag)
                )?.[1];

                if (fallbackTagPage) {
                  groupedTagPaths.push(`${groupSlug}/${fallbackTagPage.slug}`);
                  continue;
                }

                console.warn(
                  `[openapi] Missing generated tag page for "${tag}".`
                );
                continue;
              }

              groupedTagPaths.push(`${groupSlug}/${tagPage.slug}`);
            }

            if (groupedTagPaths.length === 0) continue;

            rootPages.push(`---${group.name}---`, ...groupedTagPaths);
          }

          for (const file of files) {
            if (
              file.type === 'meta' &&
              file.path === withOpenAPIBaseDir('meta.json')
            ) {
              continue;
            }

            if (file.type === 'meta') {
              const folderPath = stripOpenAPIBaseDir(file.path).slice(
                0,
                -'/meta.json'.length
              );
              const groupName = openapiTagGroupByTag.get(
                normalizeTagKey(file.data.title ?? '')
              );

              if (!groupName) {
                console.warn(
                  `[openapi] Tag folder "${file.data.title ?? folderPath}" is not assigned to a sidebar group.`
                );
                nextFiles.push(file);
                continue;
              }

              const groupSlug = slugifySegment(groupName);
              const tagPage = Array.from(tagPages.entries()).find(
                ([title]) =>
                  normalizeTagKey(title) ===
                  normalizeTagKey(file.data.title ?? '')
              )?.[1];

              if (!tagPage) {
                console.warn(
                  `[openapi] Missing generated tag page for "${file.data.title ?? folderPath}".`
                );
                nextFiles.push(file);
                continue;
              }

              const movedMeta: OpenAPIVirtualMeta = {
                ...file,
                path: withOpenAPIBaseDir(
                  `${groupSlug}/${folderPath}/meta.json`
                ),
                data: {
                  ...file.data,
                  title: tagPage.page.data.title
                }
              };

              nextFiles.push(movedMeta);
              continue;
            }

            const filePath = stripOpenAPIBaseDir(file.path);
            const [tagSlug, ...rest] = filePath.split('/');
            const tagTitle = tagTitlesBySlug.get(tagSlug);
            const groupName = tagTitle
              ? openapiTagGroupByTag.get(normalizeTagKey(tagTitle))
              : undefined;

            if (!groupName) {
              nextFiles.push(file);
              continue;
            }

            const groupSlug = slugifySegment(groupName);
            nextFiles.push({
              ...file,
              path: withOpenAPIBaseDir(
                `${groupSlug}/${tagSlug}/${rest.join('/')}`
              )
            });
          }

          for (const group of OPENAPI_TAG_GROUPS) {
            const groupSlug = slugifySegment(group.name);

            for (const tag of group.tags) {
              const tagPage =
                tagPages.get(tag) ??
                Array.from(tagPages.entries()).find(
                  ([title]) => normalizeTagKey(title) === normalizeTagKey(tag)
                )?.[1];
              if (!tagPage) continue;

              nextFiles.push({
                ...tagPage.page,
                path: withOpenAPIBaseDir(
                  `${groupSlug}/${tagPage.slug}/index.mdx`
                )
              });
            }
          }

          const rootMeta: OpenAPIVirtualMeta = {
            type: 'meta',
            path: withOpenAPIBaseDir('meta.json'),
            data: {
              title: 'OpenAPI',
              root: true,
              pages: [OPENAPI_BY_PATH_SLUG, ...rootPages]
            }
          };

          nextFiles.push(
            {
              type: 'page',
              path: withOpenAPIBaseDir(`${OPENAPI_BY_PATH_SLUG}.mdx`),
              data: {
                title: 'OpenAPI by Path',
                description: 'OpenAPI JSON files.',
                _openapiByPath: true
              }
            },
            rootMeta
          );

          return nextFiles;
        })
        .build();
    })()
  : null;

export const openapiSourceLoader = openapiPages
  ? (loader({
      baseUrl: '/content/openapi',
      source: openapiPages as Source<{
        pageData: OpenAPILoaderPageData;
        metaData: OpenAPIMetaData;
      }>,
      plugins: [lucideIconsPlugin(), openapiPlugin()]
    }) as LoaderOutput<{
      source: {
        pageData: OpenAPILoaderPageData;
        metaData: OpenAPIMetaData;
      };
      i18n: undefined;
    }>)
  : null;

export const openapiTree = openapiSourceLoader?.pageTree;

export const openapiEnabled = Boolean(openapiSourceLoader);
export const firstOpenAPIPage =
  openapiSourceLoader
    ?.getPages()
    .find(page => page.url === DEFAULT_OPENAPI_PAGE)?.url ??
  openapiSourceLoader
    ?.getPages()
    .find(
      page =>
        typeof page.data === 'object' &&
        page.data !== null &&
        'getAPIPageProps' in page.data
    )?.url;

export function isOpenAPIPageData(data: unknown): data is OpenAPIPageData {
  return typeof data === 'object' && data !== null && 'getAPIPageProps' in data;
}

export function isOpenAPIByPathPageData(
  data: unknown
): data is OpenAPIByPathPageData {
  return (
    typeof data === 'object' &&
    data !== null &&
    '_openapiByPath' in data &&
    data._openapiByPath === true
  );
}
