import { DocsBody, DocsPage } from 'fumadocs-ui/layouts/docs/page';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import type { ComponentProps } from 'react';
import { cliSource, firstCliPage } from '@/lib/source';
import { getMDXComponents } from '@/mdx-components';

interface CliPageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export default async function Page(props: CliPageProps) {
  const params = await props.params;
  if (!params.slug?.length) {
    if (!firstCliPage) notFound();
    redirect(firstCliPage);
  }

  const page = cliSource.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const RelativeLink = createRelativeLink(cliSource, page);

  const mdxHref = `/content/cli/${page.slugs.join('/')}.mdx`;

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
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: RelativeLink,
            h1: H1
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return cliSource.getPages().map(page => ({
    slug: page.slugs
  }));
}

export async function generateMetadata(props: CliPageProps): Promise<Metadata> {
  const params = await props.params;
  const page = cliSource.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description
  };
}
