"use client";

import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Wrapper from "@/components/shared/wrapper";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { cn } from "@/lib/utils";
import { useOwnerProfile } from "../hooks/use-owner-profile";

const sectionLinks = [
  { hash: "home", label: "Home" },
  { hash: "about", label: "About" },
  { hash: "skills", label: "Skills" },
  { hash: "projects", label: "Projects" },
  { hash: "experience", label: "Experience" },
  { hash: "education", label: "Education" },
] as const;

export function PortfolioHeader() {
  const { data: profile, isLoading } = useOwnerProfile();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("home");

  const label =
    profile?.shortLabel ?? (profile?.fullName ? profile.fullName.slice(0, 2) : "··");
  const onContactPage = pathname === "/contact";

  useEffect(() => {
    if (pathname !== "/") return;

    function readHash() {
      const h = window.location.hash.replace("#", "") || "home";
      setActiveHash(h);
    }
    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  }, [pathname]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-surface-variant/50 bg-surface-container-lowest/85 shadow-[0_4px_24px_rgba(15,23,42,0.04)] backdrop-blur-xl">
      <Wrapper className="flex h-[4.25rem] items-center justify-between gap-3 sm:h-[4.5rem] sm:gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
          <Link to="/" hash="home" className="group flex min-w-0 items-center gap-2.5 sm:gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-surface-variant/80 bg-gradient-to-br from-surface-container-low to-surface-container-high shadow-sm transition group-hover:border-primary/50">
              <span className="font-label-badge text-label-badge text-primary">{label}</span>
            </div>
            <div className="min-w-0 flex-col leading-tight sm:flex">
              <span className="truncate font-headline-sm text-base font-semibold tracking-tight text-on-surface sm:text-headline-sm">
                {isLoading ? "…" : (profile?.fullName ?? "Portfolio")}
              </span>
              {profile?.roleTitle ? (
                <span className="hidden truncate font-label-code text-[11px] text-on-surface-variant sm:block">
                  {profile.roleTitle}
                </span>
              ) : null}
            </div>
          </Link>

          {profile?.availability ? (
            <div className="hidden max-w-[11rem] items-center gap-1.5 rounded-full border border-primary/15 bg-primary-container/10 px-2.5 py-1 md:flex lg:max-w-xs">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="truncate font-label-badge text-[9px] uppercase tracking-wide text-on-surface-variant">
                {profile.availability}
              </span>
            </div>
          ) : null}
        </div>

        <nav
          className="hidden items-center gap-0.5 rounded-full border border-surface-variant/60 bg-surface-container-low/90 p-1 shadow-inner lg:flex"
          aria-label="Portfolio sections"
        >
          {sectionLinks.map((item) => {
            const isActive = !onContactPage && pathname === "/" && activeHash === item.hash;
            return (
              <Link
                key={item.hash}
                to="/"
                hash={item.hash}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-surface-container-highest text-primary shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container-high/80 hover:text-on-surface",
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            to="/contact"
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-all",
              onContactPage
                ? "bg-surface-container-highest text-primary shadow-sm"
                : "text-on-surface-variant hover:bg-surface-container-high/80 hover:text-on-surface",
            )}
          >
            Contact
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            to="/contact"
            className="hidden items-center justify-center gap-1.5 rounded-full bg-primary-container px-4 py-2 text-sm font-semibold text-on-primary shadow-[0_8px_20px_-6px_rgba(37,99,235,0.45)] transition hover:bg-primary active:scale-[0.98] sm:inline-flex sm:px-5"
          >
            <MaterialSymbol name="chat_bubble" className="text-[18px]" />
            Let&apos;s Talk
          </Link>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-variant/70 bg-surface-container-low text-on-surface lg:hidden"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <MaterialSymbol name={mobileOpen ? "close" : "menu"} className="text-[22px]" />
          </button>
        </div>
      </Wrapper>

      {mobileOpen ? (
        <div className="border-t border-surface-variant/50 bg-surface-container-lowest/95 backdrop-blur-lg lg:hidden">
          <Wrapper className="flex flex-col gap-1 py-3">
            {sectionLinks.map((item) => (
              <Link
                key={item.hash}
                to="/"
                hash={item.hash}
                className="rounded-xl px-4 py-3 text-sm font-medium text-on-surface hover:bg-surface-container-low"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/contact"
              className={cn(
                "rounded-xl px-4 py-3 text-sm font-medium",
                onContactPage ? "bg-primary-container/15 text-primary" : "text-on-surface hover:bg-surface-container-low",
              )}
            >
              Contact
            </Link>
            <Link
              to="/contact"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-primary-container py-3 text-sm font-semibold text-on-primary"
            >
              <MaterialSymbol name="chat_bubble" className="text-[18px]" />
              Let&apos;s Talk
            </Link>
          </Wrapper>
        </div>
      ) : null}
    </header>
  );
}