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
    <main className="flex min-h-screen w-full items-center justify-center bg-surface p-gutter font-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-space-xl">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-[680px] w-[680px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-primary/10 via-secondary-container/10 to-transparent blur-3xl" />
        <div
          className={`relative z-10 flex w-full flex-col gap-space-lg ${wide ? "max-w-2xl" : "max-w-[520px]"}`}
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
    <div className="flex items-center justify-between px-space-xs">
      <div className="inline-flex items-center gap-2 rounded-full bg-surface-container-high px-3 py-1 font-label-badge text-label-badge text-on-surface-variant shadow-sm">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
        <span className="tracking-wide">PORTFOLIO CONSOLE</span>
      </div>
      <div className="flex items-center gap-1 font-label-code text-label-code text-outline">
        <MaterialSymbol name="lock" className="text-[16px]" />
        <span className="hidden sm:inline">Access + refresh cookies</span>
      </div>
    </div>
  );
}

function AuthConsoleTrustFooter() {
  return (
    <div className="flex flex-col items-center justify-between gap-3 px-space-xs font-label-code text-[11px] text-outline sm:flex-row">
      <div className="flex items-center gap-2">
        <MaterialSymbol name="verified_user" className="text-[16px] text-secondary" />
        <span>HTTPS recommended in production</span>
      </div>
      <div className="hidden text-outline-variant sm:block">•</div>
      <div className="flex items-center gap-2">
        <MaterialSymbol name="security" className="text-[16px] text-secondary" />
        <span>HttpOnly · rotating refresh</span>
      </div>
    </div>
  );
}

export function AuthCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative flex w-full flex-col rounded-xl bg-surface-container-lowest p-8 shadow-xl transition-all duration-300 sm:p-10 ${className}`}
    >
      {children}
    </div>
  );
}