import { DocsLayoutClient } from '@/components/docs-layout-client';
import type { ReactNode } from 'react';
import {
  cliTree,
  docsTree,
  firstCliPage,
  firstOpenAPIPage,
  openapiTree
} from '@/lib/source';

interface ContentLayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: ContentLayoutProps) {
  return (
    <DocsLayoutClient
      tree={docsTree}
      cliTree={cliTree}
      openapiTree={openapiTree}
      cliHref={firstCliPage}
      openapiHref={firstOpenAPIPage}
    >
      {children}
    </DocsLayoutClient>
  );
}
