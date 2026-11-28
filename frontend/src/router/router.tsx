import { createRouter } from "@tanstack/react-router";

import { RouteErrorFallback } from "@/components/layout/route-error-fallback";
import { RouteNotFound } from "@/components/layout/route-not-found";
import { routeTree } from "./routeTree.gen";

export const router = createRouter({
  routeTree,
  defaultErrorComponent: RouteErrorFallback,
  defaultNotFoundComponent: RouteNotFound,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}