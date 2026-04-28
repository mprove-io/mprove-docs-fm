import type { StructuredData } from 'fumadocs-core/mdx-plugins';
import { createSearchAPI } from 'fumadocs-core/search/server';
import { openapiSourceLoader } from '@/lib/openapi-source';
import { cliSource, docsSource } from '@/lib/source';

interface SearchPage {
  url: string;
  data: {
    title?: string;
    description?: string;
    structuredData?: StructuredData | (() => Promise<StructuredData>);
    load?: () => Promise<{ structuredData?: StructuredData }>;
  };
}

interface SearchSource {
  getPages: () => SearchPage[];
}

interface SearchSection {
  source: SearchSource;
  tag: string;
  title: string;
}

async function getStructuredData(page: SearchPage): Promise<StructuredData> {
  if ('structuredData' in page.data) {
    const { structuredData } = page.data;
    if (typeof structuredData === 'function') return structuredData();
    if (structuredData) return structuredData;
  }

  if ('load' in page.data && typeof page.data.load === 'function') {
    const loaded = await page.data.load();
    if (loaded.structuredData) return loaded.structuredData;
  }

  throw new Error(`Cannot build search index for page: ${page.url}`);
}

async function buildSectionIndexes({ source, tag, title }: SearchSection) {
  return Promise.all(
    source.getPages().map(async page => ({
      id: `${tag}:${page.url}`,
      title: page.data.title ?? page.url,
      description: page.data.description,
      url: page.url,
      tag,
      breadcrumbs: [title],
      structuredData: await getStructuredData(page)
    }))
  );
}

async function buildIndexes() {
  const sections: SearchSection[] = [
    { source: docsSource, tag: 'docs', title: 'Docs' },
    { source: cliSource, tag: 'cli', title: 'CLI' }
  ];

  if (openapiSourceLoader) {
    sections.push({
      source: openapiSourceLoader,
      tag: 'openapi',
      title: 'OpenAPI'
    });
  }

  const indexes = await Promise.all(sections.map(buildSectionIndexes));
  return indexes.flat();
}

export const searchApi = createSearchAPI('advanced', {
  language: 'english',
  indexes: buildIndexes
});
