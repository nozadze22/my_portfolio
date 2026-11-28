"use client";

import { createFileRoute } from "@tanstack/react-router";
import { RouteErrorFallback } from "@/components/layout/route-error-fallback";
import { AdminContactMessagesPage } from "@/features/admin/pages/admin-contact-messages-page";

export const Route = createFileRoute("/admin/dashboard/messages")({
  component: AdminContactMessagesPage,
  errorComponent: RouteErrorFallback,
});