"use client";

import { createFileRoute } from "@tanstack/react-router";
import { DashboardOverviewPage } from "@/features/admin/pages/dashboard-overview-page";

export const Route = createFileRoute("/admin/dashboard/")({
  component: DashboardOverviewPage,
});