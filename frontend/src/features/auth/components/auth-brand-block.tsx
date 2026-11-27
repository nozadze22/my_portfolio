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
    <div className="mb-6 flex flex-col items-start gap-space-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary shadow-md shadow-primary/20">
          <span className="font-headline-sm text-headline-sm font-bold tracking-tighter text-on-primary">
            {initials}
          </span>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-headline-sm text-headline-sm font-extrabold tracking-tight text-on-surface">
              {brandName}
            </span>
            <span className="rounded bg-primary-fixed px-2 py-0.5 font-label-badge text-label-badge font-semibold text-on-primary-fixed">
              CONSOLE
            </span>
          </div>
          <span className="font-label-code text-[11px] uppercase tracking-wider text-outline">
            Secure boundary · role-based access
          </span>
        </div>
      </div>
      <div className="mt-3">
        <h1 className="font-headline-md text-headline-md font-bold tracking-tight text-on-surface">{title}</h1>
        <p className="mt-1 font-body-sm text-body-sm leading-relaxed text-on-surface-variant">{subtitle}</p>
      </div>
    </div>
  );
}

export function AuthSsoPlaceholderRow() {
  return (
    <div className="mb-6 grid grid-cols-2 gap-3">
      {["GitHub", "Google"].map((provider) => (
        <Button
          key={provider}
          type="button"
          variant="outline"
          disabled
          title="Coming soon"
          className="h-11 cursor-not-allowed opacity-60"
        >
          {provider}
        </Button>
      ))}
    </div>
  );
}

export function AuthOrDivider({ label }: { label: string }) {
  return (
    <div className="relative my-2 flex items-center justify-center">
      <div className="h-px w-full bg-surface-variant" />
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
      className="group mt-2 h-12 w-full gap-2 rounded-lg bg-primary-container px-6 font-headline-sm text-headline-sm font-semibold text-on-primary shadow-md shadow-primary/25 hover:bg-secondary hover:shadow-lg hover:shadow-primary/30 active:scale-[0.99]"
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
            className="text-[20px] transition-transform duration-200 group-hover:translate-x-1"
          />
        </>
      )}
    </Button>
  );
}