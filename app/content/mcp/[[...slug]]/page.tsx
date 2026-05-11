import { DocsPage } from 'fumadocs-ui/layouts/docs/page';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { McpAPIPage } from '@/components/mcp-api-page';
import {
  firstMcpPage,
  isMcpPageData,
  mcpEnabled,
  mcpSourceLoader
} from '@/lib/mcp-source';

interface McpPageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

function McpUnavailable() {
  return (
    <DocsPage toc={[]} full breadcrumb={{ enabled: false }}>
      <div className='flex items-center gap-1.5 text-lg text-fd-muted-foreground'>
        <span className='truncate text-2xl font-semibold text-fd-foreground'>
          MCP
        </span>
      </div>
      <div className='rounded-2xl border border-fd-border bg-fd-card px-6 py-8 text-sm text-fd-muted-foreground'>
        <h1 className='mb-3 text-2xl font-semibold text-fd-foreground'>MCP</h1>
        The MCP catalog could not be loaded right now, so the MCP reference is
        temporarily unavailable.
      </div>
    </DocsPage>
  );
}

function getMcpBreadcrumbLabel(page: {
  title?: string;
  getAPIPageProps: () => {
    operations?: Array<{ path: string }>;
  };
}): string {
  const apiPageProps = page.getAPIPageProps();
  const firstOperation = apiPageProps.operations?.[0];

  if (firstOperation?.path) {
    return firstOperation.path.replace(/^\/mcp\//, '').replace(/^\/+/, '');
  }

  return page.title ?? 'MCP';
}

export default async function Page(props: McpPageProps) {
  const params = await props.params;
  if (!params.slug?.length) {
    if (!mcpEnabled || !firstMcpPage) {
      return <McpUnavailable />;
    }

    redirect(firstMcpPage);
  }

  if (!mcpSourceLoader || !McpAPIPage) {
    return <McpUnavailable />;
  }

  const page = mcpSourceLoader.getPage(params.slug);
  if (!page) notFound();

  if (!isMcpPageData(page.data)) notFound();
  const breadcrumbLabel = getMcpBreadcrumbLabel(page.data);

  return (
    <DocsPage toc={page.data.toc} breadcrumb={{ enabled: false }}>
      <div className='flex flex-wrap items-center gap-x-3 gap-y-1 text-lg text-fd-muted-foreground'>
        <span className='truncate text-2xl font-semibold text-fd-foreground'>
          {breadcrumbLabel}
        </span>
      </div>
      <McpAPIPage {...page.data.getAPIPageProps()} />
    </DocsPage>
  );
}

export async function generateStaticParams() {
  if (!mcpSourceLoader) return [];

  return mcpSourceLoader.getPages().map(page => ({
    slug: page.slugs
  }));
}

export async function generateMetadata(
  props: McpPageProps
): Promise<Metadata> {
  const params = await props.params;
  if (!params.slug?.length || !mcpSourceLoader) {
    return {
      title: 'MCP',
      description: 'MCP reference is currently unavailable.'
    };
  }

  const page = mcpSourceLoader.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description
  };
}
