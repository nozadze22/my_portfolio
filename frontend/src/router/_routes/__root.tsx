import { createRootRoute, Outlet } from "@tanstack/react-router";

import { PortfolioFooter } from "@/features/portfolio/layout/portfolio-footer";
import { PortfolioHeader } from "@/features/portfolio/layout/portfolio-header";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="portfolio-app flex min-h-full flex-col bg-surface font-body-md text-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
      <PortfolioHeader />
      <main className="min-h-screen w-full bg-surface pt-20">
        <Outlet />
      </main>
      <PortfolioFooter />
    </div>
  );
}