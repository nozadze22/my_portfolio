"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { useUpdateSiteProfile } from "@/features/site/hooks/profile";
import type { SiteProfile } from "@/features/site/schema/profile.schema";
import {
  siteProfileFormSchema,
  siteProfileFormToPayload,
  siteProfileToFormValues,
  type SiteProfileFormValues,
} from "@/features/site/schema/profile-form.schema";
import { SiteFormField, SiteFormTextarea } from "./site-form-field";

export function SiteProfileForm({ profile }: { profile: SiteProfile }) {
  const saveProfile = useUpdateSiteProfile();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SiteProfileFormValues>({
    resolver: zodResolver(siteProfileFormSchema),
    defaultValues: siteProfileToFormValues(profile),
    mode: "onTouched",
  });

  useEffect(() => {
    form.reset(siteProfileToFormValues(profile));
  }, [profile, form]);

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 2500);
    return () => clearTimeout(t);
  }, [saved]);

  async function onSubmit(values: SiteProfileFormValues) {
    setError(null);
    try {
      await saveProfile.mutateAsync(siteProfileFormToPayload(values));
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save profile");
    }
  }

  const pending = form.formState.isSubmitting || saveProfile.isPending;

  return (
    <Card className="w-full overflow-hidden rounded-2xl border border-surface-variant/80 bg-surface-container-lowest shadow-lg ring-1 ring-surface-variant/40">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="contents">
          <CardHeader className="gap-1 border-b border-surface-variant/50 bg-surface-container-low/30 px-6 py-5">
            <CardTitle className="font-headline-sm text-lg font-semibold text-on-surface">
              Edit public profile
            </CardTitle>
            <CardDescription className="text-on-surface-variant">
              Changes publish immediately to the live portfolio API.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8 px-6 py-8">
            <FieldSet className="gap-4">
              <SectionLegend>Identity</SectionLegend>
              <FieldGroup className="gap-5">
                <SiteFormField control={form.control} name="fullName" label="Full name" required />
                <SiteFormField
                  control={form.control}
                  name="shortLabel"
                  label="Monogram / short label"
                  hint="Two letters in header avatar, e.g. GR"
                />
                <SiteFormField
                  control={form.control}
                  name="roleTitle"
                  label="Role title"
                  placeholder="Full-stack developer"
                />
              </FieldGroup>

              <FieldSeparator className="my-2 bg-surface-variant/40">Hero &amp; about</FieldSeparator>

              <FieldGroup className="gap-5">
                <SiteFormField
                  control={form.control}
                  name="heroTitle"
                  label="Hero title"
                  placeholder="Headline on the home section"
                />
                <SiteFormTextarea control={form.control} name="heroSubtitle" label="Hero subtitle" rows={3} />
                <SiteFormTextarea
                  control={form.control}
                  name="aboutBody"
                  label="About"
                  rows={6}
                  hint="Shown in the about section; line breaks are preserved."
                />
              </FieldGroup>

              <FieldSeparator className="my-2 bg-surface-variant/40">Contact</FieldSeparator>

              <FieldGroup className="grid gap-5 sm:grid-cols-2">
                <SiteFormField
                  control={form.control}
                  name="email"
                  label="Email"
                  type="email"
                  required
                  itemClassName="sm:col-span-2"
                />
                <SiteFormField control={form.control} name="phone" label="Phone" type="tel" />
                <SiteFormField control={form.control} name="location" label="Location" />
                <SiteFormField
                  control={form.control}
                  name="availability"
                  label="Availability"
                  placeholder="Open to opportunities"
                  itemClassName="sm:col-span-2"
                />
              </FieldGroup>

              <FieldSeparator className="my-2 bg-surface-variant/40">Social links</FieldSeparator>

              <FieldGroup className="grid gap-5 sm:grid-cols-2">
                <SiteFormField control={form.control} name="githubUrl" label="GitHub" type="url" />
                <SiteFormField control={form.control} name="linkedinUrl" label="LinkedIn" type="url" />
              </FieldGroup>
            </FieldSet>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 border-t border-surface-variant/50 bg-surface-container-low/50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-on-surface-variant">
              Last updated {profile.updatedAt.toLocaleString()}
            </p>
            <ProfileFormFooterActions error={error} saved={saved} pending={pending} />
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

function SectionLegend({ children }: { children: React.ReactNode }) {
  return (
    <FieldLegend
      variant="legend"
      className="mb-1 inline-flex rounded-full bg-surface-container-high px-3 py-1 font-label-badge text-label-badge uppercase tracking-wider text-primary"
    >
      {children}
    </FieldLegend>
  );
}

function ProfileFormFooterActions({
  error,
  saved,
  pending,
}: {
  error: string | null;
  saved: boolean;
  pending: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {error ? <span className="text-sm text-destructive">{error}</span> : null}
      {saved ? (
        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
          <MaterialSymbol name="check_circle" className="text-[18px]" />
          Saved
        </span>
      ) : null}
      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="min-w-[9rem] rounded-xl bg-primary-container font-semibold text-on-primary shadow-md hover:bg-primary"
      >
        {pending ? (
          <span className="inline-flex items-center gap-2">
            <MaterialSymbol name="progress_activity" className="animate-spin text-[18px]" />
            Saving…
          </span>
        ) : (
          "Save profile"
        )}
      </Button>
    </div>
  );
}