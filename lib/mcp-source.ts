import {
  type LoaderOutput,
  loader,
  type Source
} from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { openapiPlugin, openapiSource } from 'fumadocs-openapi/server';
import { mcp } from '@/lib/mcp';

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

export const mcpTree = mcpSourceLoader?.pageTree;
export const mcpEnabled = Boolean(mcpSourceLoader);
export const firstMcpPage = mcpSourceLoader
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
