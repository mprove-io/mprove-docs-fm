import type { OpenAPIByPathSection } from '@/lib/openapi-source';

export function renderOpenAPIByPathMarkdown(sections: OpenAPIByPathSection[]) {
  const lines = [
    '---',
    'title: OpenAPI JSON',
    'description: OpenAPI JSON files.',
    '---',
    '',
    '# OpenAPI JSON',
    '',
    'Full OpenAPI schema and request-specific schemas are listed.',
    '',
    '## Full Schema',
    '',
    '- [/openapi.json](/openapi.json)'
  ];

  for (const section of sections) {
    lines.push('', `## ${section.title}`, '');

    for (const link of section.links) {
      lines.push(`- [${link.method.toUpperCase()} ${link.path}](${link.href})`);
    }
  }

  if (sections.length === 0) {
    lines.push(
      '',
      'No request-specific OpenAPI files have been generated yet.'
    );
  }

  return `${lines.join('\n')}\n`;
}
