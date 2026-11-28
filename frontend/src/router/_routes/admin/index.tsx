import { createFileRoute, redirect } from "@tanstack/react-router";
import { getAuthMe } from "@/features/auth/api/auth";

export const Route = createFileRoute("/admin/")({
  beforeLoad: async () => {
    try {
      await getAuthMe();
    } catch {
      throw redirect({ to: "/login", search: { next: "/admin/dashboard" } });
    }
    throw redirect({ to: "/admin/dashboard" });
  },
});