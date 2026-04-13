import { HomeLayoutClient } from '@/components/home-layout-client';

export default function Layout({ children }: LayoutProps<'/'>) {
  return <HomeLayoutClient>{children}</HomeLayoutClient>;
}
