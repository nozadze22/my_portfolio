"use client";

import { MaterialSymbol } from "@/components/ui/material-symbol";
import { EmptyHint } from "../components/empty-hint";
import { ProfileError, ProfileLoading } from "../components/profile-load-state";
import { SectionHeader } from "../components/section-header";
import { SectionShell } from "../components/section-shell";
import { useOwnerProfile } from "../hooks/use-owner-profile";

export function AboutSection() {
  const { data: profile, isLoading, isError } = useOwnerProfile();

  return (
    <SectionShell id="about" className="bg-surface-container-low" containerClassName="max-w-5xl">
      {isLoading ? (
        <ProfileLoading />
      ) : isError || !profile ? (
        <ProfileError />
      ) : (
        <>
          <SectionHeader
            badge="About"
            title={profile.fullName}
            description="Who I am and what I work on."
            align="left"
          />
          <div className="grid gap-space-lg lg:grid-cols-12">
            <div className="rounded-2xl border border-surface-variant bg-surface-container-lowest p-space-lg shadow-sm lg:col-span-8">
              {profile.aboutBody ? (
                <p className="whitespace-pre-line font-body-lg leading-relaxed text-on-surface-variant">
                  {profile.aboutBody}
                </p>
              ) : (
                <EmptyHint
                  icon="person"
                  title="No bio yet"
                  hint="Set aboutBody via PATCH /profile (admin key) or seed the database."
                />
              )}
            </div>
            <aside className="flex flex-col gap-space-md lg:col-span-4">
              <InfoRow icon="mail" label="Email" value={profile.email} />
              {profile.phone ? <InfoRow icon="call" label="Phone" value={profile.phone} /> : null}
              {profile.location ? (
                <InfoRow icon="location_on" label="Location" value={profile.location} />
              ) : null}
              {profile.websiteUrl ? (
                <a
                  href={profile.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-surface-variant bg-surface-container-low px-space-md py-3 text-sm font-medium text-primary hover:bg-surface-container-high"
                >
                  <MaterialSymbol name="language" className="text-[18px]" />
                  Website
                </a>
              ) : null}
            </aside>
          </div>
        </>
      )}
    </SectionShell>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-surface-variant bg-surface-container-lowest p-space-md">
      <MaterialSymbol name={icon} className="text-[20px] text-primary" />
      <div>
        <span className="font-label-code text-xs uppercase text-on-surface-variant">{label}</span>
        <span className="block text-sm font-medium text-on-surface">{value}</span>
      </div>
    </div>
  );
}