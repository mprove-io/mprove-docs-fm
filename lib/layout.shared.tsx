import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { MobileNavTitle } from "@/components/mobile-nav-title";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: MobileNavTitle,
    },
    links: [],
    searchToggle: {
      enabled: false,
    },
  };
}
