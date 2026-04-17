'use client';

import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { DocsHeader } from '@/components/docs-header';
import { OpenAPISidebarFolder } from '@/components/openapi-sidebar-folder';
import { baseOptions } from '@/lib/layout.shared';

type DocsSection = 'docs' | 'cli' | 'openapi';

interface DocsLayoutClientProps {
  tree: Parameters<typeof DocsLayout>[0]['tree'];
  section?: DocsSection;
  isUnavailableOpenAPI?: boolean;
  openapiHref?: string;
  cliHref?: string;
  children: ReactNode;
}

export function DocsLayoutClient({
  tree,
  section = 'docs',
  isUnavailableOpenAPI = false,
  openapiHref,
  cliHref,
  children
}: DocsLayoutClientProps) {
  return (
    <DocsLayout
      key={isUnavailableOpenAPI ? 'openapi-unavailable' : section}
      tree={tree}
      tabs={false}
      sidebar={{
        enabled: !isUnavailableOpenAPI,
        components:
          section === 'openapi'
            ? {
                Folder: OpenAPISidebarFolder
              }
            : undefined
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
