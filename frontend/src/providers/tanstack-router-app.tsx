"use client";

import dynamic from "next/dynamic";

import { router } from "@/router/router";

const RouterProvider = dynamic(
  () =>
    import("@tanstack/react-router").then((mod) => mod.RouterProvider),
  { ssr: false },
);

export function TanStackRouterApp() {
  return <RouterProvider router={router} />;
}