'use client';

import type { ReactNode } from 'react';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';

interface HomeLayoutClientProps {
  children: ReactNode;
}

export function HomeLayoutClient({ children }: HomeLayoutClientProps) {
  return <HomeLayout {...baseOptions()}>{children}</HomeLayout>;
}
