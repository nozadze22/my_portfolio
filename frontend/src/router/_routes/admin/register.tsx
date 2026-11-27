import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/register")({
  beforeLoad: () => {
    throw redirect({ to: "/register" });
  },
});