"use client";

import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { PageChrome, type PageChromeProps } from "@/components/layout/page-chrome";
import Wrapper from "@/components/shared/wrapper";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { useAuthMe, useLogout } from "@/features/auth/hooks/auth";
import { useSiteProfile } from "@/features/site/hooks/profile";

const SIDEBAR_NAV = [
  { to: "/admin/dashboard", label: "Overview", icon: "dashboard" },
  { to: "/admin/dashboard/profile", label: "Portfolio", icon: "person" },
  { to: "/admin/dashboard/projects", label: "Projects", icon: "terminal" },
  { to: "/admin/dashboard/education", label: "Education", icon: "school" },
  { to: "/admin/dashboard/experience", label: "Experience", icon: "work_history" },
  { to: "/admin/dashboard/skills", label: "Skills", icon: "psychology" },
  { to: "/admin/dashboard/messages", label: "Messages", icon: "mail" },
] as const;

export function AdminConsoleLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { data: user } = useAuthMe();
  const { data: profile } = useSiteProfile();
  const logout = useLogout();

  const initials =
    profile?.shortLabel ??
    (user?.fullName?.slice(0, 2).toUpperCase() ?? user?.email?.slice(0, 2).toUpperCase() ?? "AD");

  return (
    <div className="min-h-screen">
      <header className="fixed left-0 top-0 z-50 w-full border-b border-surface-variant bg-surface-container-lowest/90 backdrop-blur-md">
        <Wrapper variant="admin" className="flex h-16 items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-md">
          <Link to="/admin/dashboard" className="flex items-center gap-space-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-variant bg-surface-container-low">
              <span className="font-label-badge text-label-badge text-primary">{initials}</span>
            </div>
            <span className="font-headline-sm text-headline-sm font-bold tracking-tight">Admin Console</span>
          </Link>
          <span className="hidden rounded-full border border-surface-variant bg-surface-container-low px-space-sm py-0.5 font-label-code text-label-code text-on-surface-variant sm:inline">
            portfolio
          </span>
        </div>
        <div className="flex items-center gap-space-md">
          <Link
            to="/"
            className="inline-flex items-center gap-space-xs font-body-sm text-body-sm text-on-surface-variant transition-colors hover:text-primary"
          >
            <MaterialSymbol name="open_in_new" className="text-[18px]" />
            <span className="hidden sm:inline">Live site</span>
          </Link>
          <div className="h-6 w-px bg-surface-variant" />
          <div className="flex items-center gap-space-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container font-label-badge text-label-badge text-on-primary">
              {initials}
            </div>
            <div className="hidden flex-col text-left md:flex">
              <span className="font-body-sm text-body-sm font-semibold leading-none">
                {user?.fullName ?? user?.email}
              </span>
              <span className="font-label-code text-label-code text-on-surface-variant">{user?.role}</span>
            </div>
          </div>
          <button
            type="button"
            title="Sign out"
            onClick={() => logout.mutate()}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant transition-colors hover:text-error"
          >
            <MaterialSymbol name="logout" className="text-[18px]" />
          </button>
        </div>
        </Wrapper>
      </header>

      <aside className="fixed left-0 top-16 z-40 flex h-[calc(100vh-4rem)] w-64 flex-col justify-between border-r border-surface-variant bg-surface-container-lowest p-space-md">
        <div className="space-y-space-md">
          <AdminNavLabel />
          <nav className="flex flex-col gap-1">
            {SIDEBAR_NAV.map((item) => {
              const active =
                item.to === "/admin/dashboard"
                  ? pathname === item.to
                  : pathname === item.to || pathname.startsWith(`${item.to}/`);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={
                    active
                      ? "flex items-center gap-2 rounded-xl bg-surface-container-high px-space-md py-space-sm font-body-sm text-body-sm font-semibold text-primary transition-colors"
                      : "flex items-center gap-2 rounded-xl px-space-md py-space-sm font-body-sm text-body-sm text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
                  }
                >
                  <MaterialSymbol name={item.icon} className="text-[18px]" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="rounded-xl border border-surface-variant bg-surface-container-low p-space-sm">
          <div className="mb-space-xs flex items-center justify-between">
            <span className="font-label-badge text-label-badge text-on-surface-variant">API</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <p className="font-label-code text-label-code text-on-surface-variant">Connected via cookie auth</p>
        </div>
      </aside>

      <main className="min-h-[calc(100vh-4rem)] w-full bg-surface pl-64 pt-16">
        <Outlet />
      </main>
    </div>
  );
}

function AdminNavLabel() {
  return (
    <div className="px-space-sm py-space-xs">
      <span className="font-label-badge text-label-badge uppercase tracking-wider text-on-surface-variant">
        Management
      </span>
    </div>
  );
}

export function AdminPageChrome(props: Omit<PageChromeProps, "tone">) {
  return <PageChrome {...props} tone="admin" />;
}