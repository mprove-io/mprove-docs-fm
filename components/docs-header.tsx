'use client';

import { usePathname } from 'fumadocs-core/framework';
import Link from 'fumadocs-core/link';
import { useDocsLayout } from 'fumadocs-ui/layouts/docs';
import {
  FullSearchTrigger,
  SearchTrigger
} from 'fumadocs-ui/layouts/shared/slots/search-trigger';
import { SidebarIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/cn';

interface DocsHeaderProps extends ComponentProps<'header'> {
  showOpenAPI?: boolean;
  openapiHref?: string;
  cliHref?: string;
}

const tabs = [
  {
    href: '/content/docs/quickstart',
    label: 'Docs',
    match: (pathname: string) =>
      pathname === '/content/docs' ||
      pathname.startsWith('/content/docs/')
  },
  {
    href: '/content/cli',
    label: 'CLI',
    match: (pathname: string) => pathname.startsWith('/content/cli')
  },
  {
    href: '/content/openapi',
    label: 'OpenAPI',
    match: (pathname: string) => pathname.startsWith('/content/openapi')
  }
] as const;

export function DocsHeader({
  showOpenAPI = true,
  openapiHref = '/content/openapi',
  cliHref = '/content/cli',
  ...props
}: DocsHeaderProps) {
  const pathname = usePathname();
  const { slots } = useDocsLayout();
  const visibleTabs = showOpenAPI
    ? tabs.map(tab =>
        tab.label === 'OpenAPI'
          ? {
              ...tab,
              href: openapiHref
            }
          : tab.label === 'CLI'
            ? {
                ...tab,
                href: cliHref
              }
            : tab
      )
    : tabs.filter(tab => tab.label !== 'OpenAPI');

  return (
    <header
      {...props}
      className={cn(
        'sticky top-(--fd-docs-row-1) z-30 border-b bg-fd-background/80 backdrop-blur-sm max-md:[grid-area:header] md:[grid-column:3/6] md:[grid-row:1/2] md:layout:[--fd-header-height:--spacing(14)] max-md:layout:[--fd-header-height:--spacing(28)]',
        props.className
      )}
    >
      <div className='hidden h-(--fd-header-height) items-center gap-3 px-4 md:flex md:px-6 xl:px-8'>
        <div className='hidden min-w-0 flex-1 items-center gap-2 md:flex'>
          {visibleTabs.map(tab => {
            const active = tab.match(pathname);

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  buttonVariants({
                    color: active ? 'secondary' : 'ghost',
                    className: 'h-9 rounded-full px-4'
                  }),
                  active && 'border-fd-border text-fd-foreground'
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        <div className='hidden min-w-0 flex-1 justify-center md:flex'>
          <FullSearchTrigger
            hideIfDisabled
            className='w-full max-w-[320px] rounded-full ps-2.5'
          />
        </div>

        <div className='hidden flex-1 md:block' />
      </div>

      <div className='space-y-3 px-4 py-3 md:hidden'>
        <div className='flex items-center gap-3'>
          {slots.navTitle && (
            <slots.navTitle className='inline-flex min-w-0 items-center gap-2.5 font-semibold' />
          )}
          <div className='flex-1' />
          <SearchTrigger hideIfDisabled className='p-2' />
          {slots.sidebar && (
            <slots.sidebar.trigger
              className={cn(
                buttonVariants({
                  color: 'ghost',
                  size: 'icon-sm',
                  className: 'p-2'
                })
              )}
            >
              <SidebarIcon />
            </slots.sidebar.trigger>
          )}
        </div>

        <div className='grid grid-cols-3 gap-2'>
          {visibleTabs.map(tab => {
            const active = tab.match(pathname);

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  buttonVariants({
                    color: active ? 'secondary' : 'ghost',
                    className:
                      'min-h-10 w-full justify-center rounded-xl px-4 text-center'
                  }),
                  active && 'border-fd-border text-fd-foreground'
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
