import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/features/admin/layout/admin-shell";
import { ensureAdminAuth } from "@/features/admin/lib/ensure-auth";

export const Route = createFileRoute("/admin/dashboard")({
  beforeLoad: ensureAdminAuth,
  component: AdminShell,
});