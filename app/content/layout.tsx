import type { ReactNode } from 'react';

interface ContentLayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: ContentLayoutProps) {
  return children;
}
