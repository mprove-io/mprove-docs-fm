import { DocsBody, DocsPage } from 'fumadocs-ui/layouts/docs/page';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { docsSource, isMdxPageData } from '@/lib/source';
import { getMDXComponents } from '@/mdx-components';

interface DocsPageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export default async function Page(props: DocsPageProps) {
  const params = await props.params;
  if (!params.slug?.length) {
    redirect('/content/docs/quickstart');
  }

  const page = docsSource.getPage(params.slug);
  if (!page) notFound();

  if (!isMdxPageData(page.data)) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(docsSource, page)
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return docsSource.generateParams();
}

export async function generateMetadata(
  props: DocsPageProps
): Promise<Metadata> {
  const params = await props.params;
  if (!params.slug?.length) {
    return {
      title: 'Quickstart'
    };
  }

  const page = docsSource.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description
    // openGraph: {
    //   images: getPageImage(page).url,
    // },
  };
}
