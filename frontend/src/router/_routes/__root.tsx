import { createRootRoute, Outlet, useRouterState } from "@tanstack/react-router";

import { AppSurface, SiteShell } from "@/components/layout/site-shell";
import { RouteErrorFallback } from "@/components/layout/route-error-fallback";
import { RouteNotFound } from "@/components/layout/route-not-found";

export const Route = createRootRoute({
  component: RootLayout,
  errorComponent: RouteErrorFallback,
  notFoundComponent: RouteNotFound,
});

function RootLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isStandalone =
    pathname.startsWith("/admin") ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/account");

  if (isStandalone) {
    return (
      <AppSurface>
        <Outlet />
      </AppSurface>
    );
  }

  return (
    <SiteShell>
      <Outlet />
    </SiteShell>
  );
}