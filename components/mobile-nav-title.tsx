import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import MproveLogo from '@/lib/mprove-logo';

export function MobileNavTitle({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span className={cn('cursor-default select-none', className)} {...props}>
      <MproveLogo height="24" />
      <span>Mprove</span>
    </span>
  );
}
