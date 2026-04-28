type OpenAPIDocument = {
  paths?: Record<string, OpenAPIPathItem>;
};

type OpenAPIPathItem = Record<string, unknown>;

export type OpenAPIOperationFileEntry = {
  href: string;
  key: string;
  method: string;
  path: string;
  tags: string[];
};

const operationMethods = new Set([
  'get',
  'put',
  'post',
  'delete',
  'options',
  'head',
  'patch',
  'trace'
]);

export function getOpenAPIOperationFileHref(
  pathName: string,
  method: string
): string {
  const segments = pathName
    .split('/')
    .filter(Boolean)
    .map(segment => slugifyPathSegment(segment));

  return `/openapi-paths/${[...segments, `${method.toLowerCase()}.json`].join(
    '/'
  )}`;
}

export function getOpenAPIOperationFileEntries(
  document: OpenAPIDocument | null
) {
  const files: OpenAPIOperationFileEntry[] = [];
  const usedHrefs = new Set<string>();

  for (const [pathName, pathItem] of Object.entries(document?.paths ?? {})) {
    if (!pathItem || typeof pathItem !== 'object') continue;

    for (const method of Object.keys(pathItem)) {
      if (!operationMethods.has(method)) continue;

      const href = resolveOperationFileHref(pathName, method, usedHrefs);
      files.push({
        key: getOpenAPIOperationKey(pathName, method),
        href,
        method,
        path: pathName,
        tags: getOperationTags(pathItem[method])
      });
    }
  }

  return files;
}

function getOperationTags(operation: unknown) {
  if (!operation || typeof operation !== 'object') return [];

  const tags = (operation as { tags?: unknown }).tags;
  if (!Array.isArray(tags)) return [];

  return tags.filter((tag): tag is string => typeof tag === 'string');
}

export function getOpenAPIOperationKey(pathName: string, method: string) {
  return `${method.toLowerCase()} ${pathName}`;
}

function resolveOperationFileHref(
  pathName: string,
  method: string,
  usedHrefs: Set<string>
): string {
  const baseHref = getOpenAPIOperationFileHref(pathName, method);
  let href = baseHref;
  let counter = 2;

  while (usedHrefs.has(href)) {
    href = baseHref.replace(/\.json$/, `-${counter}.json`);
    counter += 1;
  }

  usedHrefs.add(href);
  return href;
}

function slugifyPathSegment(segment: string): string {
  const normalized = segment
    .replace(/^\{(.+)\}$/, 'by-$1')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return normalized || '_';
}
