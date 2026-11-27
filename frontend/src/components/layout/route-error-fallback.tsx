"use client";

import { Link, type ErrorComponentProps } from "@tanstack/react-router";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { Button, buttonVariants } from "@/components/ui/button";
import Wrapper from "@/components/shared/wrapper";
import { cn } from "@/lib/utils";

function toError(value: unknown): Error {
  if (value instanceof Error) return value;
  return new Error(typeof value === "string" ? value : "Unknown error");
}

function friendlyMessage(error: Error): string {
  const msg = error.message || "";
  if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
    return "We could not reach the server. Check that the API is running and try again.";
  }
  if (msg.includes("Unauthorized") || msg.includes("401")) {
    return "Your session may have expired. Sign in again and retry.";
  }
  return "Something unexpected happened while loading this page. You can try again or go back to a safe place.";
}

export function RouteErrorFallback({ error, reset }: ErrorComponentProps) {
  const err = toError(error);
  const message = friendlyMessage(err);
  const isDev = process.env.NODE_ENV === "development";

  return (
    <div className="flex min-h-[min(100vh,48rem)] items-center justify-center bg-surface px-4 py-space-xl">
      <Wrapper variant="admin" className="max-w-lg px-0">
        <div className="overflow-hidden rounded-2xl border border-destructive/20 bg-surface-container-lowest shadow-lg ring-1 ring-surface-variant/60">
          <div className="border-b border-surface-variant/60 bg-gradient-to-br from-destructive/10 via-surface-container-low to-surface-container-lowest px-space-lg py-space-md sm:px-space-xl">
            <div className="flex items-start gap-space-sm">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-destructive/15 text-destructive">
                <MaterialSymbol name="error_outline" className="text-[28px]" />
              </span>
              <div>
                <h1 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                  Something went wrong
                </h1>
                <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">{message}</p>
              </div>
            </div>
          </div>

          <div className="space-y-space-md px-space-lg py-space-lg sm:px-space-xl">
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Button type="button" className="h-11 rounded-xl" onClick={() => reset()}>
                <MaterialSymbol name="refresh" className="mr-1 text-[18px]" />
                Try again
              </Button>
              <Link
                to="/admin/dashboard"
                className={cn(buttonVariants({ variant: "outline" }), "inline-flex h-11 items-center rounded-xl px-4")}
              >
                Admin home
              </Link>
              <Link
                to="/"
                className={cn(buttonVariants({ variant: "ghost" }), "inline-flex h-11 items-center rounded-xl px-4")}
              >
                Public site
              </Link>
            </div>

            {isDev ? (
              <details className="rounded-xl border border-surface-variant/70 bg-surface-container-low/50 p-space-sm text-xs">
                <summary className="cursor-pointer font-medium text-on-surface-variant">Technical details</summary>
                <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-words font-mono text-destructive">
                  {err.message}
                  {err.stack ? `\n\n${err.stack}` : ""}
                </pre>
              </details>
            ) : null}
          </div>
        </div>
      </Wrapper>
    </div>
  );
}