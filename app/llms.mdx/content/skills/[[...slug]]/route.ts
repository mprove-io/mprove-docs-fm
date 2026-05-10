import { notFound } from 'next/navigation';
import { getSkillText, skillsSource } from '@/lib/source';

export const revalidate = false;

interface RouteProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export async function GET(_request: Request, props: RouteProps) {
  const { slug } = await props.params;
  const page = skillsSource.getPage(slug);
  if (!page) notFound();

  return new Response(await getSkillText(page), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8'
    }
  });
}

export function generateStaticParams() {
  return skillsSource.generateParams();
}
