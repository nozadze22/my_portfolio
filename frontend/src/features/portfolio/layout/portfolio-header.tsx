"use client";

import Wrapper from "@/components/shared/wrapper";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { useOwnerProfile } from "../hooks/use-owner-profile";

const navItems = [
  { path: "home", label: "Home" },
  { path: "about", label: "About" },
  { path: "skills", label: "Skills" },
  { path: "projects", label: "Projects" },
  { path: "experience", label: "Experience" },
  { path: "education", label: "Education" },
  { path: "contact", label: "Contact" },
] as const;

export function PortfolioHeader() {
  const { data: profile, isLoading } = useOwnerProfile();
  const label =
    profile?.shortLabel ?? (profile?.fullName ? profile.fullName.slice(0, 2) : "··");

  return (
    <header className="fixed top-0 z-50 w-full border-b border-surface-variant/60 bg-surface-container-lowest/80 shadow-[0_1px_8px_rgba(0,0,0,0.02)] backdrop-blur-md">
      <Wrapper className="flex h-20 items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-md">
          <a className="group flex items-center gap-space-sm" href="#home">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-variant bg-surface-container-low transition-colors group-hover:border-primary">
              <span className="font-label-badge text-label-badge text-primary">{label}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm leading-none tracking-tight text-on-surface">
                {isLoading ? "…" : (profile?.fullName ?? "Portfolio")}
              </span>
              {profile?.roleTitle ? (
                <span className="mt-space-xs font-label-code text-label-code text-on-surface-variant">
                  {profile.roleTitle}
                </span>
              ) : null}
            </div>
          </a>
          {profile?.availability ? (
            <div className="hidden items-center gap-space-xs rounded-full border border-surface-variant/70 bg-surface-container-low px-space-sm py-1 sm:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="font-label-badge text-label-badge uppercase tracking-wider text-on-surface-variant">
                {profile.availability}
              </span>
            </div>
          ) : null}
        </div>

        <nav className="hidden items-center gap-1 rounded-full border border-surface-variant/60 bg-surface-container-low p-1 lg:flex">
          {navItems.map((item, i) => (
            <a
              key={item.path}
              href={`#${item.path}`}
              className={
                i === 0
                  ? "rounded-full bg-surface-container-high px-space-md py-space-xs font-semibold text-primary transition-colors"
                  : "rounded-full px-space-md py-space-xs font-body-sm text-body-sm text-on-surface-variant transition-colors hover:text-on-surface"
              }
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-space-md">
          <a
            className="inline-flex items-center justify-center rounded-full bg-primary-container px-space-lg py-space-sm font-body-sm text-body-sm font-semibold text-on-primary shadow-[0_10px_25px_-5px_rgba(37,99,235,0.25)] transition-all duration-200 hover:bg-primary active:scale-95"
            href="#contact"
          >
            <MaterialSymbol name="chat_bubble" className="mr-space-xs text-[18px]" />
            Let&apos;s Talk
          </a>
        </div>
      </Wrapper>
    </header>
  );
}