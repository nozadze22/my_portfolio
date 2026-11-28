import { createFileRoute, redirect } from "@tanstack/react-router";

// Registration UI disabled for now — single owner uses login only.
// Re-enable: import RegisterPage and use `component: RegisterPage` instead of redirect.

export const Route = createFileRoute("/register")({
  beforeLoad: () => {
    throw redirect({ to: "/login", search: { next: undefined } });
  },
});