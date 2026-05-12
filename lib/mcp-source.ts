import { mcpDocs } from 'collections/server';
import { type LoaderOutput, loader, type Source } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { openapiPlugin, openapiSource } from 'fumadocs-openapi/server';
import { mcp } from '@/lib/mcp';

const mcpDocsContentSource = mcpDocs.toFumadocsSource();

type McpDocsContentSource = typeof mcpDocsContentSource;
type McpDocsPageData =
  McpDocsContentSource extends Source<infer Config>
    ? Config['pageData']
    : never;
type McpDocsMetaData =
  McpDocsContentSource extends Source<infer Config>
    ? Config['metaData']
    : never;
type McpSource = Awaited<ReturnType<typeof openapiSource>>;
type McpPageData =
  McpSource extends Source<infer Config> ? Config['pageData'] : never;
type McpMetaData =
  McpSource extends Source<infer Config> ? Config['metaData'] : never;

const mcpPages = mcp
  ? await openapiSource(mcp, {
      baseDir: '',
      per: 'tag'
    })
  : null;

export const mcpDocsSource = loader({
  baseUrl: '/content/mcp',
  source: mcpDocsContentSource as Source<{
    pageData: McpDocsPageData;
    metaData: McpDocsMetaData;
  }>,
  plugins: [lucideIconsPlugin()]
}) as LoaderOutput<{
  source: {
    pageData: McpDocsPageData;
    metaData: McpDocsMetaData;
  };
  i18n: undefined;
}>;

export const mcpSourceLoader = mcpPages
  ? (loader({
      baseUrl: '/content/mcp',
      source: mcpPages as Source<{
        pageData: McpPageData;
        metaData: McpMetaData;
      }>,
      plugins: [lucideIconsPlugin(), openapiPlugin()]
    }) as LoaderOutput<{
      source: {
        pageData: McpPageData;
        metaData: McpMetaData;
      };
      i18n: undefined;
    }>)
  : null;

export const mcpTree = {
  ...mcpDocsSource.pageTree,
  children: [
    ...mcpDocsSource.pageTree.children,
    ...(mcpSourceLoader
      ? [
          { type: 'separator' as const, name: 'MCP Tools' },
          ...mcpSourceLoader.pageTree.children
        ]
      : [])
  ]
};
export const mcpEnabled = Boolean(mcpTree);
export const firstMcpPage =
  mcpDocsSource.getPages().at(0)?.url ??
  mcpSourceLoader
    ?.getPages()
    .find(
      page =>
        typeof page.data === 'object' &&
        page.data !== null &&
        'getAPIPageProps' in page.data
    )?.url;

export function isMcpPageData(data: unknown): data is McpPageData {
  return typeof data === 'object' && data !== null && 'getAPIPageProps' in data;
}

export function isMcpMdxPageData(data: unknown): data is McpDocsPageData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'body' in data &&
    'getText' in data
  );
}
