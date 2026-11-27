"use client";

import { type FormEvent, useState } from "react";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { useSendContact } from "@/features/contact/hooks/conatct";
import { ProfileError, ProfileLoading } from "../components/profile-load-state";
import { useOwnerProfile } from "../hooks/use-owner-profile";

const inputClassName =
  "w-full rounded-xl border border-surface-variant bg-surface-container-lowest px-space-md py-3 text-body-md text-on-surface transition-all placeholder:text-outline focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none";

export function ContactSection() {
  const { data: profile, isLoading, isError } = useOwnerProfile();
  const sendContact = useSendContact();
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

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    sendContact.mutate(
      {
        fullName: String(fd.get("fullName") ?? ""),
        email: String(fd.get("email") ?? ""),
        phone: String(fd.get("phone") ?? ""),
        message: String(fd.get("message") ?? ""),
      },
      {
        onSuccess: () => form.reset(),
      },
    );
  }

  return (
    <section
      id="contact"
      className="w-full border-t border-surface-variant/40 bg-surface-container-low py-space-xl lg:py-28"
    >
      <div className="mx-auto grid max-w-7xl gap-space-xl px-gutter lg:grid-cols-2">
        {isLoading ? (
          <ProfileLoading />
        ) : isError || !profile ? (
          <ProfileError />
        ) : (
          <>
            <div>
              <h2 className="font-headline-lg text-on-surface">Get in touch</h2>
              <p className="mt-space-md text-on-surface-variant">
                Messages are stored via your contact API.
              </p>
              <button
                type="button"
                onClick={copyEmail}
                className="mt-space-lg inline-flex items-center gap-2 rounded-full border border-surface-variant px-space-md py-2 text-sm"
              >
                <MaterialSymbol name="mail" />
                {profile.email}
                {copied ? " — copied" : null}
              </button>
            </div>
            <form
              className="space-y-space-md rounded-2xl border border-surface-variant bg-surface-container-lowest p-space-lg"
              onSubmit={onSubmit}
            >
              <Field label="Name" name="fullName" required />
              <Field label="Email" name="email" type="email" required />
              <Field label="Phone" name="phone" required placeholder="+995..." />
              <label className="flex flex-col gap-1 text-sm" htmlFor="message">
                Message
                <textarea
                  id="message"
                  name="message"
                  required
                  minLength={10}
                  rows={4}
                  className={`${inputClassName} resize-y`}
                />
              </label>
              <button
                type="submit"
                disabled={sendContact.isPending}
                className="rounded-full bg-primary-container px-space-xl py-3 font-semibold text-on-primary disabled:opacity-60"
              >
                {sendContact.isPending ? "Sending…" : "Send"}
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm" htmlFor={name}>
      {label}
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className={inputClassName}
      />
    </label>
  );
}