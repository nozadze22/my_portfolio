import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/features/auth/pages/login-page";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    next: typeof search.next === "string" ? search.next : undefined,
  }),
  component: LoginPage,
});