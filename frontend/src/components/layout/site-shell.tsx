import type { ReactNode } from "react";

import { PortfolioFooter } from "@/features/portfolio/layout/portfolio-footer";
import { PortfolioHeader } from "@/features/portfolio/layout/portfolio-header";

const siteSurfaceClass =
  "portfolio-app flex min-h-full flex-col bg-surface font-body-md text-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed";

type SiteShellProps = {
  children: ReactNode;
  /** Extra classes on `<main>` (e.g. no top padding for custom heroes) */
  mainClassName?: string;
};

/** Public portfolio chrome: fixed header, scrollable main, footer. */
export function SiteShell({ children, mainClassName }: SiteShellProps) {
  return (
    <div className={siteSurfaceClass}>
      <PortfolioHeader />
      <main className={`min-h-screen w-full flex-1 bg-surface pt-20 ${mainClassName ?? ""}`.trim()}>
        {children}
      </main>
      <PortfolioFooter />
    </div>
  );
}

/** Routes without marketing header (admin, auth, account). */
export function AppSurface({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`min-h-screen bg-surface font-body-md text-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed ${className ?? ""}`.trim()}
    >
      {children}
    </div>
  );
}