'use client';

import type * as PageTree from 'fumadocs-core/page-tree';
import {
  SidebarFolder,
  SidebarFolderContent,
  SidebarFolderTrigger,
  useFolderDepth
} from 'fumadocs-ui/components/sidebar/base';
import { useTreePath } from 'fumadocs-ui/contexts/tree';
import { cn } from '@/lib/cn';

function getItemOffset(depth: number) {
  return `calc(${2 + 3 * depth} * var(--spacing))`;
}

function OpenAPISidebarFolderTrigger({
  children
}: {
  children: React.ReactNode;
}) {
  const depth = useFolderDepth();

  return (
    <SidebarFolderTrigger
      className={cn(
        'relative flex w-full flex-row items-center gap-2 rounded-lg p-2 text-start text-fd-muted-foreground wrap-anywhere transition-colors hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80 hover:transition-none [&_svg]:size-4 [&_svg]:shrink-0'
      )}
      style={{
        paddingInlineStart: getItemOffset(depth - 1)
      }}
    >
      {children}
    </SidebarFolderTrigger>
  );
}

export function OpenAPISidebarFolder({
  item,
  children
}: {
  item: PageTree.Folder;
  children: React.ReactNode;
}) {
  const path = useTreePath();

  return (
    <SidebarFolder
      active={path.includes(item)}
      collapsible={item.collapsible}
      defaultOpen={item.defaultOpen}
    >
      <OpenAPISidebarFolderTrigger>
        {item.icon}
        {item.name}
      </OpenAPISidebarFolderTrigger>
      <SidebarFolderContent className="relative before:absolute before:inset-y-1 before:inset-s-2.5 before:w-px before:bg-fd-border before:content-['']">
        <div className="flex flex-col gap-0.5 pt-0.5">{children}</div>
      </SidebarFolderContent>
    </SidebarFolder>
  );
}
