import { createFileRoute, redirect } from "@tanstack/react-router";

// Registration disabled — send to admin login flow.

export const Route = createFileRoute("/admin/register")({
  beforeLoad: () => {
    throw redirect({ to: "/login", search: { next: "/admin/dashboard" } });
  },
});