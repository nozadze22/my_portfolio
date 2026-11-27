"use client";

import { createFileRoute } from "@tanstack/react-router";
import { RouteErrorFallback } from "@/components/layout/route-error-fallback";
import { AdminProjectsPage } from "@/features/admin/pages/admin-projects-page";

export const Route = createFileRoute("/admin/dashboard/projects")({
  component: AdminProjectsPage,
  errorComponent: RouteErrorFallback,
});