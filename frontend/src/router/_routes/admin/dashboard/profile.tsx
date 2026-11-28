"use client";

import { createFileRoute } from "@tanstack/react-router";
import { AdminSiteProfilePage } from "@/features/admin/pages/admin-profile-page";

export const Route = createFileRoute("/admin/dashboard/profile")({
  component: AdminSiteProfilePage,
});