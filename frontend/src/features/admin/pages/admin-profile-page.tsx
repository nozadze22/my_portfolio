"use client";

import { Card, CardContent } from "@/components/ui/card";
import Wrapper from "@/components/shared/wrapper";
import { AdminPageChrome } from "@/features/admin/layout/admin-console-layout";
import { SiteProfileForm } from "@/features/site/components/admin/site-profile-form";
import { useSiteProfile } from "@/features/site/hooks/profile";

export function AdminSiteProfilePage() {
  const { data: profile, isLoading } = useSiteProfile();

  return (
    <AdminPageChrome
      breadcrumb={["Admin Console", "Portfolio", "Site profile"]}
      title="Site profile"
      description="Hero copy, about section, contact details, and availability on the public site."
    >
      <Wrapper className="max-w-3xl px-0 sm:px-0 lg:px-0">
        {isLoading || !profile ? (
          <Card className="rounded-2xl border-surface-variant/80 bg-surface-container-lowest shadow-sm">
            <CardContent className="py-16 text-center text-sm text-on-surface-variant">Loading profile…</CardContent>
          </Card>
        ) : (
          <SiteProfileForm profile={profile} />
        )}
      </Wrapper>
    </AdminPageChrome>
  );
}