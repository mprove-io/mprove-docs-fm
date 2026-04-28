import { notFound } from 'next/navigation';
import { renderOpenAPIByPathMarkdown } from '@/lib/openapi-by-path';
import { openapiByPathSections } from '@/lib/openapi-source';

export const revalidate = false;

interface RouteProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export async function GET(_request: Request, props: RouteProps) {
  const { slug } = await props.params;
  if (slug?.join('/') !== 'openapi-by-path') notFound();

  return new Response(renderOpenAPIByPathMarkdown(openapiByPathSections), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8'
    }
  });
}

export function generateStaticParams() {
  return [{ slug: ['openapi-by-path'] }];
}
