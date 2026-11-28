"use client";

import { Link } from "@tanstack/react-router";
import { type ReactNode, useState } from "react";
import Wrapper from "@/components/shared/wrapper";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { ContactForm } from "../components/contact-form";
import { ProfileError, ProfileLoading } from "../components/profile-load-state";
import { useOwnerProfile } from "../hooks/use-owner-profile";

export function ContactPage() {
  const { data: profile, isLoading, isError } = useOwnerProfile();
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    if (!profile?.email) return;
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="relative w-full overflow-hidden">
      <div className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-primary-container/25 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-24 h-96 w-96 rounded-full bg-secondary-container/20 blur-3xl" />

      <Wrapper className="pb-space-xl pt-6 lg:pb-24 lg:pt-10">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-1 text-sm font-medium text-on-surface-variant transition hover:text-primary"
        >
          <MaterialSymbol name="arrow_back" className="text-[18px]" />
          Back to portfolio
        </Link>

        {isLoading ? (
          <ProfileLoading />
        ) : isError || !profile ? (
          <ProfileError />
        ) : (
          <>
            <div className="mb-12 max-w-2xl">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-container/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                <MaterialSymbol name="forum" className="text-[16px]" />
                Contact
              </span>
              <h1 className="font-display-hero text-display-hero tracking-tight text-on-surface max-sm:text-display-hero-mobile">
                Let&apos;s build something{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  together
                </span>
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-on-surface-variant">
                Open to interesting projects, collaborations, and conversations. Use the form or reach
                out directly — I read every message.
              </p>
            </div>

            <div className="grid gap-10 lg:grid-cols-5 lg:gap-12">
              <aside className="flex flex-col gap-4 lg:col-span-2">
                <ContactCard
                  icon="mail"
                  title="Email"
                  action={
                    <button
                      type="button"
                      onClick={copyEmail}
                      className="mt-2 text-left text-sm font-medium text-primary hover:underline"
                    >
                      {profile.email}
                      {copied ? " — copied" : null}
                    </button>
                  }
                />
                {profile.location ? (
                  <ContactCard icon="location_on" title="Location" lines={[profile.location]} />
                ) : null}
                {profile.phone ? (
                  <ContactCard
                    icon="call"
                    title="Phone"
                    lines={[
                      <a key="p" href={`tel:${profile.phone}`} className="text-primary hover:underline">
                        {profile.phone}
                      </a>,
                    ]}
                  />
                ) : null}
                {profile.availability ? (
                  <div className="rounded-2xl border border-surface-variant/50 bg-surface-container-low/60 p-5">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                        Status
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-medium text-on-surface">{profile.availability}</p>
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-2 pt-2">
                  {profile.githubUrl ? (
                    <SocialChip href={profile.githubUrl} icon="code" label="GitHub" />
                  ) : null}
                  {profile.linkedinUrl ? (
                    <SocialChip href={profile.linkedinUrl} icon="work" label="LinkedIn" />
                  ) : null}
                </div>
              </aside>

              <div className="lg:col-span-3">
                <ContactForm />
              </div>
            </div>
          </>
        )}
      </Wrapper>
    </div>
  );
}

function ContactCard({
  icon,
  title,
  lines,
  action,
}: {
  icon: string;
  title: string;
  lines?: ReactNode[];
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-surface-variant/50 bg-surface-container-lowest/80 p-5 shadow-sm transition hover:border-primary/25 hover:shadow-md">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-container-high text-primary">
          <MaterialSymbol name={icon} className="text-[24px]" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">{title}</p>
          {lines?.map((line, i) => (
            <p key={i} className="mt-1 text-sm text-on-surface">
              {line}
            </p>
          ))}
          {action}
        </div>
      </div>
    </div>
  );
}

function SocialChip({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-surface-variant/70 bg-surface-container-low px-4 py-2 text-sm font-medium text-on-surface transition hover:border-primary/40 hover:text-primary"
    >
      <MaterialSymbol name={icon} className="text-[18px]" />
      {label}
    </a>
  );
}