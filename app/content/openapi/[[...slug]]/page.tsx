import { DocsPage } from 'fumadocs-ui/layouts/docs/page';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { APIPage } from '@/components/api-page';
import {
  firstOpenAPIPage,
  isOpenAPIPageData,
  openapiEnabled,
  openapiSourceLoader
} from '@/lib/source';

interface OpenAPIPageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

function getOpenAPIBreadcrumbLabel(page: {
  title?: string;
  getAPIPageProps: () => {
    operations?: Array<{ path: string }>;
    webhooks?: Array<{ name: string }>;
  };
}): string {
  const apiPageProps = page.getAPIPageProps();
  const firstOperation = apiPageProps.operations?.[0];
  const firstWebhook = apiPageProps.webhooks?.[0];

  if (firstOperation?.path) {
    return firstOperation.path
      .replace(/^\/api\/ToBackend/, '')
      .replace(/^\/api\//, '')
      .replace(/^\/+/, '');
  }

  if (firstWebhook?.name) {
    return firstWebhook.name.replace(/^\/+/, '');
  }

  return page.title ?? 'OpenAPI';
}

function OpenAPIUnavailable() {
  return (
    <DocsPage toc={[]} full breadcrumb={{ enabled: false }}>
      <div className='flex items-center gap-1.5 text-lg text-fd-muted-foreground'>
        <span className='truncate text-2xl font-semibold text-fd-foreground'>
          OpenAPI
        </span>
      </div>
      <div className='rounded-2xl border border-fd-border bg-fd-card px-6 py-8 text-sm text-fd-muted-foreground'>
        <h1 className='mb-3 text-2xl font-semibold text-fd-foreground'>
          OpenAPI
        </h1>
        The OpenAPI schema could not be loaded right now, so the API reference
        is temporarily unavailable.
      </div>
    </DocsPage>
  );
}

export default async function Page(props: OpenAPIPageProps) {
  const params = await props.params;
  if (!params.slug?.length) {
    if (!openapiEnabled || !firstOpenAPIPage) {
      return <OpenAPIUnavailable />;
    }

    redirect(firstOpenAPIPage);
  }

  if (!openapiSourceLoader || !APIPage) {
    return <OpenAPIUnavailable />;
  }

  const page = openapiSourceLoader.getPage(params.slug);
  if (!page || !isOpenAPIPageData(page.data)) notFound();
  const breadcrumbLabel = getOpenAPIBreadcrumbLabel(page.data);

  return (
    <DocsPage toc={page.data.toc} breadcrumb={{ enabled: false }}>
      <div className='flex items-center gap-1.5 text-lg text-fd-muted-foreground'>
        <span className='truncate text-2xl font-semibold text-fd-foreground'>
          {breadcrumbLabel}
        </span>
      </div>
      <APIPage {...page.data.getAPIPageProps()} />
    </DocsPage>
  );
}

export async function generateStaticParams() {
  if (!openapiSourceLoader) return [];

  return openapiSourceLoader.getPages().map(page => ({
    slug: page.slugs
  }));
}

export async function generateMetadata(
  props: OpenAPIPageProps
): Promise<Metadata> {
  const params = await props.params;
  if (!params.slug?.length || !openapiSourceLoader) {
    return {
      title: 'OpenAPI',
      description: 'OpenAPI reference is currently unavailable.'
    };
  }

  const page = openapiSourceLoader.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description
  };
}
