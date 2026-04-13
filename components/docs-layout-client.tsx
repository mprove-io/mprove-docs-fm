'use client';

import { usePathname } from 'fumadocs-core/framework';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { DocsHeader } from '@/components/docs-header';
import { baseOptions } from '@/lib/layout.shared';

interface DocsLayoutClientProps {
  tree: Parameters<typeof DocsLayout>[0]['tree'];
  cliTree?: Parameters<typeof DocsLayout>[0]['tree'];
  openapiTree?: Parameters<typeof DocsLayout>[0]['tree'];
  openapiHref?: string;
  cliHref?: string;
  children: ReactNode;
}

export function DocsLayoutClient({
  tree,
  cliTree,
  openapiTree,
  openapiHref,
  cliHref,
  children
}: DocsLayoutClientProps) {
  const pathname = usePathname();
  const hasOpenAPITree = Boolean(openapiTree);
  const isOpenAPIPath = pathname.startsWith('/content/openapi');
  const isUnavailableOpenAPI = isOpenAPIPath && !hasOpenAPITree;
  const section =
    hasOpenAPITree && isOpenAPIPath
      ? 'openapi'
      : cliTree && pathname.startsWith('/content/cli')
        ? 'cli'
        : 'docs';
  const activeTree =
    section === 'openapi'
      ? (openapiTree ?? tree)
      : section === 'cli'
        ? (cliTree ?? tree)
        : tree;

  return (
    <DocsLayout
      key={isUnavailableOpenAPI ? 'openapi-unavailable' : section}
      tree={activeTree}
      tabs={false}
      sidebar={{
        enabled: !isUnavailableOpenAPI
      }}
      slots={{
        header: props => (
          <DocsHeader {...props} openapiHref={openapiHref} cliHref={cliHref} />
        )
      }}
      {...baseOptions()}
    >
      {children}
    </DocsLayout>
  );
}
