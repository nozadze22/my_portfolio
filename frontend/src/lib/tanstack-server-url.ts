import { headers } from "next/headers";

/** Read URL info set in `src/middleware.ts` (use inside Suspense). */
export async function getTanStackRequestUrl(): Promise<string> {
  const headerStore = await headers();
  return headerStore.get("x-url") ?? "/";
}