"use client";

import { MaterialSymbol } from "@/components/ui/material-symbol";
import { useOwnerProfile } from "../hooks/use-owner-profile";

export function PortfolioFooter() {
  const { data: profile } = useOwnerProfile();

  if (!profile) {
    return (
      <footer className="w-full border-t border-surface-variant bg-surface-container-lowest">
        <div className="mx-auto max-w-7xl px-gutter py-space-xl">
          <p className="text-center text-xs text-outline">Portfolio</p>
        </div>
      </footer>
    );
  }

  const label = profile.shortLabel ?? profile.fullName.slice(0, 2);
  const socials = [
    profile.githubUrl && { href: profile.githubUrl, icon: "code" as const },
    profile.linkedinUrl && { href: profile.linkedinUrl, icon: "share" as const },
    profile.twitterUrl && { href: profile.twitterUrl, icon: "terminal" as const },
    { href: `mailto:${profile.email}`, icon: "mail" as const },
  ].filter(Boolean) as { href: string; icon: string }[];

  return (
    <footer className="w-full border-t border-surface-variant bg-surface-container-lowest">
      <div className="mx-auto max-w-7xl px-gutter py-space-xl">
        <div className="flex flex-col items-center justify-between gap-space-md md:flex-row">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <span className="font-label-badge text-primary">{label}</span>
            <span className="font-headline-sm text-on-surface">{profile.fullName}</span>
            {profile.roleTitle ? (
              <p className="text-sm text-on-surface-variant">{profile.roleTitle}</p>
            ) : null}
          </div>
          <div className="flex gap-2">
            {socials.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target={s.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-variant text-on-surface hover:text-primary"
              >
                <MaterialSymbol name={s.icon} className="text-[20px]" />
              </a>
            ))}
          </div>
        </div>
        <p className="mt-space-lg text-center text-xs text-outline">
          Personal portfolio — single owner mode.
        </p>
      </div>
    </footer>
  );
}