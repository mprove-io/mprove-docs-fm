import type { ReactNode } from 'react';
import { DocsLayoutClient } from '@/components/docs-layout-client';
import { docsTree, firstCliPage, firstOpenAPIPage } from '@/lib/source';

interface DocsSectionLayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: DocsSectionLayoutProps) {
  return (
    <DocsLayoutClient
      section='docs'
      tree={docsTree}
      cliHref={firstCliPage}
      openapiHref={firstOpenAPIPage}
    >
      {children}
    </DocsLayoutClient>
  );
}
