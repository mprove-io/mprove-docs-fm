import { DocsBody, DocsPage } from 'fumadocs-ui/layouts/docs/page';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import type { ComponentProps } from 'react';
import { McpAPIPage } from '@/components/mcp-api-page';
import {
  firstMcpPage,
  isMcpMdxPageData,
  isMcpPageData,
  mcpDocsSource,
  mcpEnabled,
  mcpSourceLoader
} from '@/lib/mcp-source';
import { getMDXComponents } from '@/mdx-components';

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

  const mdxPage = mcpDocsSource.getPage(params.slug);
  if (mdxPage) {
    if (!isMcpMdxPageData(mdxPage.data)) notFound();

    const MDX = mdxPage.data.body;
    const mdxHref = `/content/mcp/${mdxPage.slugs.join('/')}.mdx`;

    function H1({ children, ...props }: ComponentProps<'h1'>) {
      return (
        <>
          <a
            className='text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
            href={mdxHref}
            target='_blank'
            rel='noopener noreferrer'
          >
            .mdx
          </a>
          <h1 {...props}>{children}</h1>
        </>
      );
    }

    return (
      <DocsPage toc={mdxPage.data.toc} full={mdxPage.data.full}>
        <DocsBody>
          <MDX
            components={getMDXComponents({
              a: createRelativeLink(mcpDocsSource, mdxPage),
              h1: H1
            })}
          />
        </DocsBody>
      </DocsPage>
    );
  }

  if (!mcpSourceLoader || !McpAPIPage) {
    notFound();
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
  return [
    ...mcpDocsSource.getPages().map(page => ({
      slug: page.slugs
    })),
    ...(mcpSourceLoader?.getPages().map(page => ({
      slug: page.slugs
    })) ?? [])
  ];
}

export async function generateMetadata(props: McpPageProps): Promise<Metadata> {
  const params = await props.params;
  if (!params.slug?.length) {
    return {
      title: 'MCP',
      description: 'MCP reference is currently unavailable.'
    };
  }

  const mdxPage = mcpDocsSource.getPage(params.slug);
  if (mdxPage) {
    return {
      title: mdxPage.data.title,
      description: mdxPage.data.description
    };
  }

  if (!mcpSourceLoader) notFound();

  const page = mcpSourceLoader.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description
  };
}
