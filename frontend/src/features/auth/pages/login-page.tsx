"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
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
          title={isAdminFlow ? "Admin authentication" : "Sign in"}
          subtitle="Use your portfolio account. Admins manage projects and profile; users get a personal account only."
        />
        <AuthSsoPlaceholderRow />
        <AuthOrDivider label="Or continue with email" />
        <Form {...form}>
          <form className="mt-4 space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <AuthFormEmailField control={form.control} name="email" />
            <AuthFormPasswordField control={form.control} name="password" label="Password" />
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <AuthSubmitButton pending={pending} label="Sign in" pendingLabel="Signing in…" />
          </form>
        </Form>
        <div className="mt-6 flex justify-center border-t border-surface-container pt-5 text-center">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            New account?{" "}
            <Link to="/register" className="ml-1 font-semibold text-primary underline-offset-4 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </AuthCard>
    </AuthConsoleShell>
  );
}