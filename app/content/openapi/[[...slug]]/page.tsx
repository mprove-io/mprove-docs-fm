import { DocsBody, DocsPage } from 'fumadocs-ui/layouts/docs/page';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { APIPage } from '@/components/api-page';
import { getOpenAPIOperationKey } from '@/lib/openapi-operation-files';
import {
  firstOpenAPIPage,
  isOpenAPIByPathPageData,
  isOpenAPIPageData,
  openapiByPathSections,
  openapiEnabled,
  openapiOperationFileHrefByKey,
  openapiSourceLoader
} from '@/lib/openapi-source';

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

function OpenAPIByPathPage() {
  const jsonLinkProps = {
    target: '_blank',
    rel: 'noopener noreferrer'
  };

  return (
    <DocsPage toc={[]} breadcrumb={{ enabled: false }}>
      <DocsBody>
        <h1>OpenAPI JSON</h1>
        <p>Full OpenAPI schema and request-specific schemas are listed.</p>
        <h2>Full Schema</h2>
        <ul>
          <li>
            <a href='/openapi.json' {...jsonLinkProps}>
              /openapi.json
            </a>
          </li>
        </ul>
        {openapiByPathSections.map(section => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            <ul>
              {section.links.map(link => (
                <li key={link.href}>
                  <a href={link.href} {...jsonLinkProps}>
                    {link.method.toUpperCase()} {link.path}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
        {openapiByPathSections.length === 0 ? (
          <ul>
            <li>No request-specific OpenAPI files have been generated yet.</li>
          </ul>
        ) : null}
      </DocsBody>
    </DocsPage>
  );
}

function getOperationJsonHref(page: {
  getAPIPageProps: () => {
    operations?: Array<{ path: string; method: string }>;
  };
}): string | undefined {
  const operation = page.getAPIPageProps().operations?.[0];
  if (!operation) return undefined;

  return openapiOperationFileHrefByKey.get(
    getOpenAPIOperationKey(operation.path, operation.method)
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
  if (!page) notFound();

  if (isOpenAPIByPathPageData(page.data)) {
    return <OpenAPIByPathPage />;
  }

  if (!isOpenAPIPageData(page.data)) notFound();
  const breadcrumbLabel = getOpenAPIBreadcrumbLabel(page.data);
  const operationJsonHref = getOperationJsonHref(page.data);

  return (
    <DocsPage toc={page.data.toc} breadcrumb={{ enabled: false }}>
      <div className='flex flex-wrap items-center gap-x-3 gap-y-1 text-lg text-fd-muted-foreground'>
        <span className='truncate text-2xl font-semibold text-fd-foreground'>
          {breadcrumbLabel}
        </span>
        {operationJsonHref ? (
          <a
            className='text-sm font-medium text-fd-muted-foreground underline underline-offset-4 hover:text-fd-foreground'
            href={operationJsonHref}
            target='_blank'
            rel='noopener noreferrer'
          >
            .json
          </a>
        ) : null}
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
