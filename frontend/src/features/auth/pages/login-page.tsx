"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { Route as LoginRoute } from "@/router/_routes/login";
import { AuthCard, AuthConsoleShell } from "@/features/auth/components/auth-console-shell";
import {
  AuthBrandBlock,
  AuthFormEmailField,
  AuthFormPasswordField,
  AuthOrDivider,
  AuthSsoPlaceholderRow,
  AuthSubmitButton,
} from "@/features/auth/components/auth-brand-block";
import { pathAfterLogin } from "@/features/admin/lib/auth-redirect";
import { useLogin } from "@/features/auth/hooks/auth";
import { type LoginInput, loginDefaultValues, loginSchema } from "@/features/auth/schema/auth.schema";

export function LoginPage() {
  const navigate = useNavigate();
  const login = useLogin();
  const { next } = LoginRoute.useSearch();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: loginDefaultValues,
    mode: "onTouched",
  });

  async function onSubmit(values: LoginInput) {
    setError(null);
    try {
      const res = await login.mutateAsync(values);
      const target = next ?? pathAfterLogin(res.user);
      await navigate({ to: target as "/admin/dashboard" | "/account" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    }
  }

  const isAdminFlow = next === "/admin/dashboard";
  const pending = form.formState.isSubmitting || login.isPending;

  return (
    <AuthConsoleShell>
      <AuthCard>
        <AuthBrandBlock
          title={isAdminFlow ? "Admin sign in" : "Welcome back"}
          subtitle={
            isAdminFlow
              ? "Access the dashboard to edit projects, profile, skills, and contact messages."
              : "Use the email and password for your portfolio account."
          }
        />
        <AuthSsoPlaceholderRow />
        <AuthOrDivider label="Or continue with email" />
        <Form {...form}>
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <AuthFormEmailField control={form.control} name="email" placeholder="you@example.com" />
            <AuthFormPasswordField control={form.control} name="password" label="Password" />
            {error ? (
              <p className="flex items-start gap-2 rounded-xl border border-destructive/25 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
                <MaterialSymbol name="error" className="mt-0.5 shrink-0 text-[18px]" />
                <span>{error}</span>
              </p>
            ) : null}
            <AuthSubmitButton pending={pending} label="Sign in" pendingLabel="Signing in…" />
          </form>
        </Form>
        {/* Registration disabled until needed — see router/_routes/register.tsx */}
      </AuthCard>
    </AuthConsoleShell>
  );
}