"use client";

import { type FormEvent } from "react";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { useSendContact } from "@/features/contact/hooks/conatct";

const inputClassName =
  "w-full rounded-xl border border-surface-variant/80 bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface shadow-sm transition-all placeholder:text-outline focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none";

export function ContactForm({ className = "" }: { className?: string }) {
  const sendContact = useSendContact();

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
    <form
      className={`space-y-4 rounded-2xl border border-surface-variant/60 bg-surface-container-lowest/90 p-6 shadow-lg ring-1 ring-surface-variant/30 backdrop-blur-sm sm:p-8 ${className}`}
      onSubmit={onSubmit}
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container text-on-primary">
          <MaterialSymbol name="edit_note" className="text-[22px]" />
        </span>
        <div>
          <h3 className="font-headline-sm text-lg font-semibold text-on-surface">Send a message</h3>
          <p className="text-sm text-on-surface-variant">I&apos;ll get back to you when I can.</p>
        </div>
      </div>

      <Field label="Name" name="fullName" required />
      <Field label="Email" name="email" type="email" required />
      <Field label="Phone" name="phone" placeholder="+995..." />
      <label className="flex flex-col gap-1.5 text-sm font-medium text-on-surface" htmlFor="message">
        Message
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          rows={5}
          placeholder="Tell me about your project, timeline, or question…"
          className={`${inputClassName} resize-y`}
        />
      </label>

      {sendContact.isError ? (
        <p className="text-sm text-destructive">Could not send. Try again later.</p>
      ) : null}
      {sendContact.isSuccess ? (
        <p className="flex items-center gap-1 text-sm text-primary">
          <MaterialSymbol name="check_circle" className="text-[18px]" />
          Message sent — thank you!
        </p>
      ) : null}

      <button
        type="submit"
        disabled={sendContact.isPending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-container px-6 py-3.5 font-semibold text-on-primary shadow-md transition hover:bg-primary disabled:opacity-60 sm:w-auto"
      >
        <MaterialSymbol name="send" className="text-[20px]" />
        {sendContact.isPending ? "Sending…" : "Send message"}
      </button>
    </form>
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
    <label className="flex flex-col gap-1.5 text-sm font-medium text-on-surface" htmlFor={name}>
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