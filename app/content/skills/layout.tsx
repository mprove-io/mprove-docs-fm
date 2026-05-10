import type { ReactNode } from 'react';
import { DocsLayoutClient } from '@/components/docs-layout-client';
import { firstCliPage, firstSkillsPage, skillsTree } from '@/lib/source';

interface SkillsSectionLayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: SkillsSectionLayoutProps) {
  return (
    <DocsLayoutClient
      section='skills'
      tree={skillsTree}
      cliHref={firstCliPage}
      skillsHref={firstSkillsPage}
    >
      {children}
    </DocsLayoutClient>
  );
}
