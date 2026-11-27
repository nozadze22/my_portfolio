"use client";

import { createFileRoute, Link } from "@tanstack/react-router";
import { useLogout, useAuthMe } from "@/features/auth/hooks/auth";
import { ensureUserAuth } from "@/features/admin/lib/ensure-auth";
import { AuthConsoleShell } from "@/features/auth/components/auth-console-shell";

export const Route = createFileRoute("/account")({
  beforeLoad: ensureUserAuth,
  component: AccountPage,
  validateSearch: (s: Record<string, unknown>) => ({
    forbidden: typeof s.forbidden === "string" ? s.forbidden : undefined,
  }),
});

function AccountPage() {
  const { data: user } = useAuthMe();
  const logout = useLogout();
  const { forbidden } = Route.useSearch();

  return (
    <AuthConsoleShell>
      <div className="rounded-2xl border border-surface-variant bg-surface-container-lowest p-space-lg shadow-sm">
        <h1 className="font-headline-md text-headline-md text-on-surface">Your account</h1>
        {forbidden === "admin" ? (
          <p className="mt-2 text-sm text-destructive">
            This area is for admins only. Your role is <strong>{user?.role}</strong>.
          </p>
        ) : null}
        <dl className="mt-space-md space-y-2 text-sm">
          <DetailRow label="Email" value={user?.email ?? ""} />
          <DetailRow label="Role" value={user?.role ?? ""} />
          {user?.fullName ? <DetailRow label="Name" value={user.fullName} /> : null}
        </dl>
        {user?.role === "ADMIN" ? (
          <Link to="/admin/dashboard" className="mt-space-md inline-block text-sm font-medium text-primary">
            Open admin dashboard →
          </Link>
        ) : null}
        <div className="mt-space-lg flex gap-space-md border-t border-surface-variant pt-space-md">
          <Link to="/" className="text-sm text-on-surface-variant hover:text-primary">
            Back to site
          </Link>
          <button type="button" onClick={() => logout.mutate()} className="text-sm text-destructive">
            Log out
          </button>
        </div>
      </div>
    </AuthConsoleShell>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-on-surface-variant">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}