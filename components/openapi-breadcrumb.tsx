'use client';

import type { BreadcrumbOptions } from 'fumadocs-core/breadcrumb';
import { type ComponentProps } from 'react';
import { cn } from '@/lib/cn';

type OpenAPIBreadcrumbProps = BreadcrumbOptions &
  ComponentProps<'div'> & {
    label?: string | null;
  };

export function OpenAPIBreadcrumb({
  className,
  label,
  ...props
}: OpenAPIBreadcrumbProps) {
  if (!label) return null;

  return (
    <div
      {...props}
      className={cn('flex items-center gap-1.5 text-sm text-fd-muted-foreground', className)}
    >
      <span className='truncate font-medium text-fd-foreground'>{label}</span>
    </div>
  );
}
