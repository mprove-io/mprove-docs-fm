import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import MproveLogo from "./mprove-logo";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <MproveLogo height="24"></MproveLogo> Mprove Docs
        </>
      ),
    },
    links: [],
  };
}
