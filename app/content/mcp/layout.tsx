import type { ReactNode } from 'react';
import { DocsLayoutClient } from '@/components/docs-layout-client';
import { firstMcpPage, mcpTree } from '@/lib/mcp-source';
import { firstOpenAPIPage } from '@/lib/openapi-source';
import { docsTree, firstCliPage, firstSkillsPage } from '@/lib/source';

interface McpSectionLayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: McpSectionLayoutProps) {
  return (
    <DocsLayoutClient
      section='mcp'
      tree={mcpTree ?? docsTree}
      isUnavailableMcp={!mcpTree}
      cliHref={firstCliPage}
      skillsHref={firstSkillsPage}
      openapiHref={firstOpenAPIPage}
      mcpHref={firstMcpPage}
    >
      {children}
    </DocsLayoutClient>
  );
}
