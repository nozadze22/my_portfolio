"use client";

import { createFileRoute } from "@tanstack/react-router";
import { RouteErrorFallback } from "@/components/layout/route-error-fallback";
import { AdminEducationPage } from "@/features/admin/pages/admin-education-page";

export const Route = createFileRoute("/admin/dashboard/education")({
  component: AdminEducationPage,
  errorComponent: RouteErrorFallback,
});