import { createFileRoute } from "@tanstack/react-router";

import { ContactPage } from "@/features/portfolio/pages/contact-page";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});