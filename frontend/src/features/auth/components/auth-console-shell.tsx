import type { ReactNode } from "react";
import { MaterialSymbol } from "@/components/ui/material-symbol";

export function AuthConsoleShell({
  children,
  wide = false,
}: {
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-surface p-gutter font-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,color-mix(in_srgb,var(--color-primary)_14%,transparent),transparent)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute -left-32 top-1/4 h-72 w-72 rounded-full bg-secondary-container/25 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-24 bottom-1/4 h-80 w-80 rounded-full bg-primary/10 blur-3xl" aria-hidden />

      <div className="relative z-10 flex w-full flex-col items-center justify-center py-space-xl">
        <div
          className={`flex w-full flex-col gap-space-lg ${wide ? "max-w-2xl" : "max-w-[480px]"}`}
        >
          <AuthConsoleStatusBar />
          {children}
          <AuthConsoleTrustFooter />
        </div>
      </div>
    </main>
  );
}

function AuthConsoleStatusBar() {
  return (
    <div className="flex items-center justify-between gap-3 px-space-xs">
      <div className="inline-flex items-center gap-2 rounded-full border border-outline-variant/35 bg-surface-container-lowest/90 px-3 py-1.5 font-label-badge text-label-badge text-on-surface-variant shadow-sm backdrop-blur-sm">
        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
        <span className="tracking-wide">Portfolio console</span>
      </div>
      <div className="hidden items-center gap-1.5 rounded-full border border-transparent px-2 py-1 font-label-code text-[11px] text-outline sm:flex">
        <MaterialSymbol name="encrypted" className="text-[16px] text-secondary" />
        <span>Secure session</span>
      </div>
    </div>
  );
}

function AuthConsoleTrustFooter() {
  return (
    <p className="text-center font-label-code text-[11px] leading-relaxed text-outline">
      Cookie-based auth · refresh token rotation · use HTTPS in production
    </p>
  );
}

export function AuthCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-outline-variant/25 bg-surface-container-lowest/95 p-8 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-10 ${className}`}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/8 blur-2xl"
        aria-hidden
      />
      <div className="relative">{children}</div>
    </div>
  );
}