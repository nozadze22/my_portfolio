"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { AuthCard, AuthConsoleShell } from "@/features/auth/components/auth-console-shell";
import {
  AuthBrandBlock,
  AuthFormEmailField,
  AuthFormField,
  AuthFormPasswordField,
  AuthFormTermsField,
  AuthOrDivider,
  AuthSsoPlaceholderRow,
  AuthSubmitButton,
} from "@/features/auth/components/auth-brand-block";
import { PasswordStrength } from "@/features/auth/components/password-strength";
import { pathAfterLogin } from "@/features/admin/lib/auth-redirect";
import { useRegister } from "@/features/auth/hooks/auth";
import {
  type RegisterFormInput,
  registerDefaultValues,
  registerFormSchema,
} from "@/features/auth/schema/auth.schema";

export function RegisterPage() {
  const navigate = useNavigate();
  const register = useRegister();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RegisterFormInput>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: registerDefaultValues,
    mode: "onTouched",
  });

  const password = form.watch("password") ?? "";

  async function onSubmit(values: RegisterFormInput) {
    setError(null);
    try {
      const { confirmPassword: _c, terms: _t, ...payload } = values;
      const res = await register.mutateAsync(payload);
      await navigate({ to: pathAfterLogin(res.user) });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  }

  const pending = form.formState.isSubmitting || register.isPending;

  return (
    <AuthConsoleShell wide>
      <AuthCard className="relative overflow-hidden sm:p-12">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-fixed-dim via-primary-container to-secondary-container" />
        <div className="mb-space-lg text-center sm:text-left">
          <AuthBrandBlock
            title="Create account"
            subtitle="First signup becomes ADMIN (dashboard). Later signups are USER accounts."
          />
        </div>
        <AuthSsoPlaceholderRow />
        <AuthOrDivider label="Or register with email" />
        <Form {...form}>
          <form className="mt-space-md space-y-space-md" onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
              <AuthFormField
                control={form.control}
                name="fullName"
                label="Full name"
                symbol="badge"
                placeholder="Your name"
                type="text"
                autoComplete="name"
              />
              <AuthFormEmailField control={form.control} name="email" />
            </div>
            <div className="space-y-2">
              <AuthFormPasswordField
                control={form.control}
                name="password"
                labelAside="Min. 8 characters"
              />
              <PasswordStrength password={password} />
            </div>
            <AuthFormPasswordField
              control={form.control}
              name="confirmPassword"
              label="Confirm password"
              confirm
            />
            <AuthFormTermsField
              control={form.control}
              label="I agree to use this account only for managing or viewing this portfolio."
            />
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <AuthSubmitButton pending={pending} label="Complete registration" pendingLabel="Creating account…" />
          </form>
        </Form>
        <div className="mt-space-lg border-t border-surface-container pt-space-sm text-center">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Already registered?{" "}
            <Link
              to="/login"
              search={{ next: undefined }}
              className="font-semibold text-primary transition-colors hover:text-primary-container"
            >
              Sign in →
            </Link>
          </p>
        </div>
      </AuthCard>
    </AuthConsoleShell>
  );
}