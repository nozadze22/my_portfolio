"use client";

import dynamic from "next/dynamic";

import { router } from "@/router/router";
import { QueryProvider } from "@/providers/query-provider";

const RouterProvider = dynamic(
  () =>
    import("@tanstack/react-router").then((mod) => mod.RouterProvider),
  { ssr: false },
);

export function TanStackRouterApp() {
  return (
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  );
}