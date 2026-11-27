import { getTanStackRequestUrl } from "@/lib/tanstack-server-url";

/** Keeps the request path in HTML for refresh/SEO hints without blocking the shell. */
export async function TanStackPathHint() {
  const url = await getTanStackRequestUrl();

  return (
    <span className="sr-only" aria-hidden>
      {url}
    </span>
  );
}