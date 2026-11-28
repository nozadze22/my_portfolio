"use client";

import { useMemo, useState } from "react";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { AdminMetricCard } from "@/features/admin/components/admin-metric-card";
import { AdminPageChrome } from "@/features/admin/layout/admin-console-layout";
import {
  ContactMessageDetail,
  ContactMessageListItem,
} from "@/features/contact/components/admin/contact-message-card";
import { useGetContactList, useMarkContactRead } from "@/features/contact/hooks/conatct";

const PAGE_SIZE = 12;

export function AdminContactMessagesPage() {
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading, isError, refetch, isFetching } = useGetContactList({
    page,
    limit: PAGE_SIZE,
  });
  const markRead = useMarkContactRead();

  const items = useMemo(() => data?.data ?? [], [data?.data]);
  const meta = data?.meta;
  const total = meta?.total ?? 0;
  const unread = meta?.unread ?? items.filter((m) => !m.isRead).length;

  const selected = useMemo(() => {
    if (items.length === 0) return null;
    if (selectedId) {
      const current = items.find((m) => m.id === selectedId);
      if (current) return current;
    }
    return items[0] ?? null;
  }, [items, selectedId]);

  function handleMarkRead() {
    if (!selected) return;
    markRead.mutate(selected.id);
  }

  return (
    <AdminPageChrome
      breadcrumb={["Admin Console", "Inbox", "Messages"]}
      title="Contact inbox"
      description="Messages sent from the public contact page — reply by email or phone from each card."
      actions={
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex cursor-pointer items-center gap-space-xs rounded-lg border border-surface-variant bg-surface-container-low px-space-md py-2.5 font-body-sm text-body-sm font-semibold text-on-surface transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <MaterialSymbol name="refresh" className={isFetching ? "animate-spin text-[20px]" : "text-[20px]"} />
          Refresh
        </button>
      }
    >
      <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
        <AdminMetricCard label="Total messages" value={String(total)} hint="All time" icon="inbox" />
        <AdminMetricCard
          label="Unread"
          value={String(unread)}
          hint="Needs your attention"
          icon="mark_email_unread"
          fillIcon
        />
      </div>

      {isLoading ? (
        <p className="text-sm text-on-surface-variant">Loading messages…</p>
      ) : isError ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/5 p-space-md text-sm text-destructive">
          Could not load contact messages. Make sure you are signed in as admin.
        </p>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-outline-variant/45 bg-surface-container-low/35 px-space-lg py-16 text-center">
          <MaterialSymbol name="mail" className="mb-3 text-[48px] text-on-surface-variant" />
          <p className="font-headline-sm text-on-surface">No messages yet</p>
          <p className="mt-1 max-w-md text-sm text-on-surface-variant">
            When visitors submit the form on your contact page, they will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="grid gap-space-md lg:grid-cols-[minmax(280px,360px)_1fr] lg:items-stretch">
          <aside className="flex max-h-[min(70vh,640px)] flex-col rounded-2xl border border-surface-variant bg-surface-container-low p-space-sm">
            <div className="mb-2 px-2 font-label-badge text-label-badge uppercase tracking-wider text-on-surface-variant">
              Inbox ({items.length})
            </div>
            <p className="mb-3 px-2 text-xs text-on-surface-variant">
              Unread messages are highlighted on the left.
            </p>
            <InboxList
              className="flex flex-1 flex-col gap-1 overflow-y-auto pr-1"
              items={items}
              selectedId={selected?.id}
              onSelect={setSelectedId}
            />
            {meta && meta.totalPages > 1 ? (
              <div className="mt-space-sm flex items-center justify-between border-t border-surface-variant/80 pt-space-sm">
                <button
                  type="button"
                  disabled={!meta.hasPreviousPage}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-lg px-3 py-1.5 text-sm text-on-surface-variant hover:bg-surface-container-high disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="font-label-code text-label-code text-on-surface-variant">
                  {meta.page} / {meta.totalPages}
                </span>
                <button
                  type="button"
                  disabled={!meta.hasNextPage}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg px-3 py-1.5 text-sm text-on-surface-variant hover:bg-surface-container-high disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            ) : null}
          </aside>
          <div className="min-h-[320px]">
            {selected ? (
              <ContactMessageDetail
                message={selected}
                onMarkRead={handleMarkRead}
                marking={markRead.isPending}
              />
            ) : null}
          </div>
        </div>
      )}
    </AdminPageChrome>
  );
}

function InboxList({
  items,
  selectedId,
  onSelect,
  className,
}: {
  items: Parameters<typeof ContactMessageListItem>[0]["message"][];
  selectedId?: string;
  onSelect: (id: string) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      {items.map((message) => (
        <ContactMessageListItem
          key={message.id}
          message={message}
          selected={message.id === selectedId}
          onSelect={() => onSelect(message.id)}
        />
      ))}
    </div>
  );
}