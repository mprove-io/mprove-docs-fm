import type { ReactNode } from 'react';
import { DocsLayoutClient } from '@/components/docs-layout-client';
import {
  docsTree,
  firstCliPage,
  firstOpenAPIPage,
  openapiTree
} from '@/lib/source';

interface OpenAPISectionLayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: OpenAPISectionLayoutProps) {
  return (
    <DocsLayoutClient
      section='openapi'
      tree={openapiTree ?? docsTree}
      isUnavailableOpenAPI={!openapiTree}
      cliHref={firstCliPage}
      openapiHref={firstOpenAPIPage}
    >
      {children}
    </DocsLayoutClient>
  );
}
