import type { ReactNode } from 'react';
import { DocsLayoutClient } from '@/components/docs-layout-client';
import { cliTree, firstCliPage, firstSkillsPage } from '@/lib/source';

interface CliSectionLayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: CliSectionLayoutProps) {
  return (
    <DocsLayoutClient
      section='cli'
      tree={cliTree}
      cliHref={firstCliPage}
      skillsHref={firstSkillsPage}
    >
      {children}
    </DocsLayoutClient>
  );
}
