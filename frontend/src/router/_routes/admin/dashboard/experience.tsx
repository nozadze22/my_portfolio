"use client";

import { createFileRoute } from "@tanstack/react-router";
import { AdminExperiencePage } from "@/features/admin/pages/admin-experience-page";

export const Route = createFileRoute("/admin/dashboard/experience")({
  component: AdminExperiencePage,
});