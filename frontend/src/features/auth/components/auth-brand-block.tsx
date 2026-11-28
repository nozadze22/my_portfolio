"use client";

import { MaterialSymbol } from "@/components/ui/material-symbol";
import { Button } from "@/components/ui/button";
import { useSiteProfile } from "@/features/site/hooks/profile";
export {
  AuthFormField,
  AuthFormEmailField,
  AuthFormPasswordField,
  AuthFormTermsField,
} from "./auth-form-field";

export function AuthBrandBlock({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const { data: profile } = useSiteProfile();
  const initials =
    profile?.shortLabel ??
    (profile?.fullName ? profile.fullName.slice(0, 2).toUpperCase() : "PO");
  const brandName = profile?.fullName ?? "Portfolio";

  return (
    <div className="mb-8 flex flex-col gap-space-md">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/85 shadow-lg shadow-primary/25">
          <span className="font-headline-sm text-headline-sm font-bold tracking-tighter text-on-primary">
            {initials}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-headline-sm text-headline-sm font-extrabold tracking-tight text-on-surface">
              {brandName}
            </span>
            <span className="rounded-md bg-primary-fixed/15 px-2 py-0.5 font-label-badge text-[10px] font-bold uppercase tracking-wider text-primary">
              Console
            </span>
          </div>
          <span className="font-label-code text-[11px] text-on-surface-variant">
            Sign in to manage your portfolio
          </span>
        </div>
      </div>
      <div>
        <h1 className="font-headline-md text-headline-md font-bold tracking-tight text-on-surface">{title}</h1>
        <p className="mt-2 font-body-sm text-body-sm leading-relaxed text-on-surface-variant">{subtitle}</p>
      </div>
    </div>
  );
}

const SSO_PROVIDERS = [
  { id: "github", label: "GitHub", icon: "code" as const },
  { id: "google", label: "Google", icon: "account_circle" as const },
] as const;

export function AuthSsoPlaceholderRow() {
  return (
    <div className="mb-2 grid grid-cols-2 gap-3">
      {SSO_PROVIDERS.map((provider) => (
        <Button
          key={provider.id}
          type="button"
          variant="outline"
          disabled
          title="Coming soon"
          className="relative h-11 cursor-not-allowed rounded-xl border-outline-variant/40 bg-surface-container-low/50 opacity-70"
        >
          <MaterialSymbol name={provider.icon} className="mr-2 text-[18px] text-on-surface-variant" />
          {provider.label}
          <span className="ml-2 rounded bg-surface-container-high px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-outline">
            Soon
          </span>
        </Button>
      ))}
    </div>
  );
}

export function AuthOrDivider({ label }: { label: string }) {
  return (
    <div className="relative my-6 flex items-center justify-center">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-surface-variant to-transparent" />
      <span className="absolute bg-surface-container-lowest px-3 font-label-code text-[11px] uppercase tracking-wide text-outline">
        {label}
      </span>
    </div>
  );
}

export function AuthSubmitButton({
  pending,
  label,
  pendingLabel,
}: {
  pending: boolean;
  label: string;
  pendingLabel: string;
}) {
  return (
    <Button
      type="submit"
      disabled={pending}
      className="group mt-1 h-12 w-full cursor-pointer gap-2 rounded-xl bg-primary px-6 font-headline-sm text-headline-sm font-semibold text-on-primary shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/25 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? (
        <>
          <MaterialSymbol name="progress_activity" className="animate-spin text-[20px]" />
          <span>{pendingLabel}</span>
        </>
      ) : (
        <>
          <span>{label}</span>
          <MaterialSymbol
            name="arrow_forward"
            className="text-[20px] transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </>
      )}
    </Button>
  );
}