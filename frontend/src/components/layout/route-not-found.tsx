"use client";

import { Link, useRouterState } from "@tanstack/react-router";

import { FadeIn } from "@/app/components/motion/fade-in";
import Wrapper from "@/components/shared/wrapper";
import { buttonVariants } from "@/components/ui/button";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { cn } from "@/lib/utils";

const quickLinks = [
  { to: "/" as const, label: "Home", icon: "home" as const },
  { to: "/about" as const, label: "About", icon: "info" as const },
  { to: "/contact" as const, label: "Contact", icon: "mail" as const },
];

export function RouteNotFound() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/admin");
  const isAuth =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/account");

  const useCompactChrome = isAdmin || isAuth;

  if (useCompactChrome) {
    return (
      <div className="flex min-h-[min(100vh,48rem)] items-center justify-center bg-surface px-4 py-space-xl">
        <Wrapper variant="admin" className="max-w-lg px-0">
          <NotFoundCard pathname={pathname} compact adminHome={isAdmin} />
        </Wrapper>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden">
      <div className="pointer-events-none absolute -left-24 top-8 h-72 w-72 rounded-full bg-primary-container/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-32 h-96 w-96 rounded-full bg-tertiary-container/25 blur-3xl" />
      <Wrapper className="flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center py-space-xl lg:py-24">
        <FadeIn className="w-full max-w-2xl">
          <NotFoundCard pathname={pathname} />
        </FadeIn>
      </Wrapper>
    </div>
  );
}

type NotFoundCardProps = {
  pathname: string;
  compact?: boolean;
  adminHome?: boolean;
};

function NotFoundCard({ pathname, compact, adminHome }: NotFoundCardProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-surface-variant/70 bg-surface-container-lowest text-center shadow-lg ring-1 ring-surface-variant/50",
        compact ? "text-left" : "",
      )}
    >
      <div
        className={cn(
          "border-b border-surface-variant/60 bg-gradient-to-br from-primary-container/25 via-surface-container-low to-surface-container-lowest",
          compact ? "px-space-lg py-space-md sm:px-space-xl" : "px-space-lg py-space-xl sm:px-space-xl",
        )}
      >
        <p
          className={cn(
            "font-display-hero text-transparent",
            compact
              ? "bg-gradient-to-r from-primary to-secondary bg-clip-text text-[4.5rem] font-extrabold leading-none tracking-tighter"
              : "bg-gradient-to-r from-primary via-secondary to-tertiary bg-clip-text text-[7rem] font-extrabold leading-none tracking-tighter sm:text-[8.5rem]",
          )}
          aria-hidden
        >
          404
        </p>
        <div className={cn(compact ? "mt-space-sm" : "mt-space-md", "space-y-2")}>
          <h1 className="font-headline-md text-headline-md font-semibold tracking-tight text-on-surface">
            Page not found
          </h1>
          <p className="font-body-md text-body-md leading-relaxed text-on-surface-variant">
            ეს მისამართი არსებობად არ არის — შეამოწმე ბმული ან დაბრუნდი პორტფოლიოზე.
          </p>
        </div>
      </div>

      <div className={cn("space-y-space-md", compact ? "px-space-lg py-space-lg sm:px-space-xl" : "px-space-lg py-space-xl sm:px-space-xl")}>
        <div className="rounded-xl border border-surface-variant/60 bg-surface-container-low/60 px-space-md py-space-sm text-left">
          <p className="font-label-code text-label-code text-on-surface-variant">Requested path</p>
          <p className="mt-1 break-all font-mono text-sm font-medium text-on-surface">{pathname || "/"}</p>
        </div>

        <div className={cn("flex flex-col gap-2", compact ? "sm:flex-row sm:flex-wrap" : "sm:flex-row sm:justify-center sm:flex-wrap")}>
          <Link to="/" className={cn(buttonVariants(), "inline-flex h-11 items-center justify-center rounded-xl px-5")}>
            <MaterialSymbol name="home" className="mr-1 text-[18px]" />
            Back to home
          </Link>
          {adminHome ? (
            <Link
              to="/admin/dashboard"
              className={cn(buttonVariants({ variant: "outline" }), "inline-flex h-11 items-center justify-center rounded-xl px-5")}
            >
              <MaterialSymbol name="dashboard" className="mr-1 text-[18px]" />
              Admin dashboard
            </Link>
          ) : (
            <Link
              to="/contact"
              className={cn(buttonVariants({ variant: "outline" }), "inline-flex h-11 items-center justify-center rounded-xl px-5")}
            >
              <MaterialSymbol name="mail" className="mr-1 text-[18px]" />
              Contact
            </Link>
          )}
        </div>

        {!compact ? (
          <nav className="flex flex-wrap items-center justify-center gap-2 border-t border-surface-variant/50 pt-space-md">
            {quickLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="inline-flex items-center gap-1 rounded-full border border-surface-variant/70 bg-surface-container-low px-3 py-1.5 text-sm font-medium text-on-surface-variant transition hover:border-primary/40 hover:text-primary"
              >
                <MaterialSymbol name={item.icon} className="text-[16px]" />
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </div>
    </div>
  );
}