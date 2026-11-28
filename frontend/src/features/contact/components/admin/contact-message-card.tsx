"use client";

import { MaterialSymbol } from "@/components/ui/material-symbol";
import { cn } from "@/lib/utils";
import type { ContactMessage } from "../../schema/conatct.schema";

function formatWhen(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function ContactMessageListItem({
  message,
  selected,
  onSelect,
}: {
  message: ContactMessage;
  selected: boolean;
  onSelect: () => void;
}) {
  const preview =
    message.message.length > 96 ? `${message.message.slice(0, 96).trim()}…` : message.message;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn("cursor-pointer",
        "flex w-full flex-col gap-1 rounded-xl border p-space-md text-left transition-all",
        selected
          ? "border-primary/50 bg-primary-container/10 shadow-sm"
          : "border-transparent bg-surface-container-low hover:border-surface-variant hover:bg-surface-container-high",
        !message.isRead && !selected && "border-l-4 border-l-primary bg-surface-container-lowest",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-body-sm text-body-sm font-semibold text-on-surface">{message.name}</p>
          <p className="truncate font-label-code text-label-code text-on-surface-variant">{message.email}</p>
        </div>
        {!message.isRead ? (
          <span className="shrink-0 rounded-full bg-primary px-2 py-0.5 font-label-badge text-[10px] font-bold uppercase tracking-wide text-on-primary">
            New
          </span>
        ) : null}
      </div>
      <p className="line-clamp-2 text-sm text-on-surface-variant">{preview}</p>
      <span className="font-label-code text-[11px] text-on-surface-variant">{formatWhen(message.createdAt)}</span>
    </button>
  );
}

export function ContactMessageDetail({
  message,
  onMarkRead,
  marking,
}: {
  message: ContactMessage;
  onMarkRead: () => void;
  marking?: boolean;
}) {
  const mailHref = `mailto:${encodeURIComponent(message.email)}?subject=${encodeURIComponent("Re: Your message on my portfolio")}`;
  const telHref = message.phone ? `tel:${message.phone.replace(/\s/g, "")}` : null;

  return (
    <article className="flex h-full min-h-[320px] flex-col rounded-2xl border border-surface-variant bg-surface-container-lowest shadow-sm">
      <header className="border-b border-surface-variant/80 p-space-lg">
        <div className="flex flex-wrap items-start justify-between gap-space-md">
          <div className="flex gap-space-md">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-container text-on-primary">
              <MaterialSymbol name="person" className="text-[26px]" />
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">{message.name}</h2>
              <p className="mt-0.5 font-label-code text-label-code text-on-surface-variant">
                {formatWhen(message.createdAt)}
              </p>
            </div>
          </div>
          {!message.isRead ? (
            <button
              type="button"
              disabled={marking}
              onClick={onMarkRead}
              className="inline-flex items-center gap-1.5 rounded-lg bg-surface-container-high px-space-md py-2 font-body-sm text-body-sm font-semibold text-primary transition-colors hover:bg-primary-container disabled:opacity-50"
            >
              <MaterialSymbol name="done_all" className="text-[18px]" />
              Mark as read
            </button>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full border border-surface-variant bg-surface-container-low px-3 py-1 font-label-code text-label-code text-on-surface-variant">
              <MaterialSymbol name="mark_email_read" className="text-[16px] text-emerald-600" />
              Read
            </span>
          )}
        </div>
        <div className="mt-space-md flex flex-wrap gap-2">
          <a
            href={mailHref}
            className="inline-flex items-center gap-1.5 rounded-lg border border-surface-variant bg-surface-container-low px-3 py-2 font-body-sm text-body-sm text-on-surface transition-colors hover:border-primary hover:text-primary"
          >
            <MaterialSymbol name="mail" className="text-[18px]" />
            {message.email}
          </a>
          {telHref ? (
            <a
              href={telHref}
              className="inline-flex items-center gap-1.5 rounded-lg border border-surface-variant bg-surface-container-low px-3 py-2 font-body-sm text-body-sm text-on-surface transition-colors hover:border-primary hover:text-primary"
            >
              <MaterialSymbol name="call" className="text-[18px]" />
              {message.phone}
            </a>
          ) : null}
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-space-lg">
        <p className="whitespace-pre-wrap font-body-md text-body-md leading-relaxed text-on-surface">{message.message}</p>
      </div>
    </article>
  );
}