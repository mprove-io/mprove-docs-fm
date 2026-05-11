'use client';

import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { DocsHeader } from '@/components/docs-header';
import { OpenAPISidebarFolder } from '@/components/openapi-sidebar-folder';
import { baseOptions } from '@/lib/layout.shared';

type DocsSection = 'docs' | 'cli' | 'skills' | 'openapi' | 'mcp';

interface DocsLayoutClientProps {
  tree: Parameters<typeof DocsLayout>[0]['tree'];
  section?: DocsSection;
  isUnavailableOpenAPI?: boolean;
  isUnavailableMcp?: boolean;
  openapiHref?: string;
  cliHref?: string;
  skillsHref?: string;
  mcpHref?: string;
  children: ReactNode;
}

export function DocsLayoutClient({
  tree,
  section = 'docs',
  isUnavailableOpenAPI = false,
  isUnavailableMcp = false,
  openapiHref,
  cliHref,
  skillsHref,
  mcpHref,
  children
}: DocsLayoutClientProps) {
  const sidebarDisabled =
    (section === 'openapi' && isUnavailableOpenAPI) ||
    (section === 'mcp' && isUnavailableMcp);

  return (
    <DocsLayout
      key={
        sidebarDisabled
          ? `${section}-unavailable`
          : section
      }
      tree={tree}
      tabs={false}
      containerProps={{
        className:
          'max-md:[--fd-header-height:7rem] md:[--fd-header-height:3.5rem] md:[--fd-sidebar-width:268px] xl:[--fd-toc-width:268px]'
      }}
      sidebar={{
        enabled: !sidebarDisabled,
        components:
          section === 'openapi' || section === 'mcp'
            ? {
                Folder: OpenAPISidebarFolder
              }
            : undefined
      }}
      slots={{
        header: props => (
          <DocsHeader
            {...props}
            openapiHref={openapiHref}
            cliHref={cliHref}
            skillsHref={skillsHref}
            mcpHref={mcpHref}
          />
        )
      }}
      {...baseOptions()}
    >
      {children}
    </DocsLayout>
  );
}
