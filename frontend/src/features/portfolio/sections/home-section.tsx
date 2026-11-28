"use client";

import Wrapper from "@/components/shared/wrapper";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { ProfileError, ProfileLoading } from "../components/profile-load-state";
import { useOwnerProfile } from "../hooks/use-owner-profile";

export function HomeSection() {
  const { data: profile, isLoading, isError } = useOwnerProfile();

  return (
    <section
      id="home"
      className="relative w-full overflow-hidden bg-surface-container-lowest py-space-xl lg:py-24"
    >
      <div className="pointer-events-none absolute top-0 right-1/4 -z-10 h-96 w-96 rounded-full bg-secondary-container/20 blur-3xl" />
      <Wrapper>
        {isLoading ? (
          <ProfileLoading />
        ) : isError || !profile ? (
          <ProfileError />
        ) : (
          <div className="grid grid-cols-1 items-center gap-space-lg lg:grid-cols-12">
            <div className="flex flex-col items-start lg:col-span-7">
              {profile.availability ? (
                <div className="mb-space-lg inline-flex items-center gap-2 rounded-full border border-surface-variant bg-surface-container-low px-space-md py-1.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
                  </span>
                  <span className="font-label-badge uppercase tracking-wider text-primary">
                    {profile.availability}
                  </span>
                </div>
              ) : null}
              <h1 className="mb-space-md max-w-4xl font-display-hero text-display-hero tracking-tight text-on-surface max-sm:text-display-hero-mobile">
                {profile.heroTitle ?? (
                  <>
                    Hi, I&apos;m {profile.fullName}
                    <span className="mt-1 block bg-gradient-to-r from-primary via-primary-container to-secondary bg-clip-text text-transparent">
                      {profile.roleTitle ?? ""}
                    </span>
                  </>
                )}
              </h1>
              {profile.heroSubtitle ? (
                <p className="mb-space-xl max-w-2xl font-body-lg leading-relaxed text-on-surface-variant">
                  {profile.heroSubtitle}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-space-md">
                <a
                  href="#projects"
                  className="group inline-flex items-center gap-2 rounded-full bg-primary-container px-space-xl py-3.5 font-semibold text-on-primary shadow-[0_10px_25px_-5px_rgba(37,99,235,0.3)] hover:bg-primary"
                >
                  View projects
                  <MaterialSymbol
                    name="arrow_forward"
                    className="text-[18px] transition-transform group-hover:translate-x-1"
                  />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-outline-variant px-space-xl py-3.5 font-medium hover:border-primary"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>
        )}
      </Wrapper>
    </section>
  );
}