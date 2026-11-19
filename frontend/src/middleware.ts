import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { isTanStackDocumentPath } from "@/lib/tanstack-paths";

/**
 * Runs before Next.js renders. Passes the current URL to the app so the
 * TanStack Router shell can align with deep links (refresh on /about, etc.).
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);
  requestHeaders.set("x-url", `${pathname}${search}`);
  requestHeaders.set(
    "x-tanstack-known-route",
    isTanStackDocumentPath(pathname) ? "1" : "0",
  );

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};