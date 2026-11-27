"use client";

import { createFileRoute } from "@tanstack/react-router";
import { AdminSkillsPage } from "@/features/admin/pages/admin-skills-page";

export const Route = createFileRoute("/admin/dashboard/skills")({
  component: AdminSkillsPage,
});