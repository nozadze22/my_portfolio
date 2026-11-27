import type { ReactNode } from "react";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import Wrapper from "@/components/shared/wrapper";
import { cn } from "@/lib/utils";

type AdminSplitLayoutProps = {
  list: ReactNode;
  aside: ReactNode;
  asideTitle: string;
  asideHint?: string;
  asideIcon?: string;
  emptyState?: {
    icon: string;
    title: string;
    description: string;
  };
  isEmpty?: boolean;
  className?: string;
};

/** List + sticky form column, centered inside admin main via Wrapper. */
export function AdminSplitLayout({
  list,
  aside,
  asideTitle,
  asideHint = "Required fields are marked with *",
  asideIcon = "add_circle",
  emptyState,
  isEmpty,
  className,
}: AdminSplitLayoutProps) {
  return (
    <Wrapper variant="admin" className={cn("w-full max-w-page px-0 sm:px-0 lg:px-0", className)}>
      <div className="grid w-full grid-cols-1 items-start gap-space-lg xl:grid-cols-[minmax(0,1fr)_22.5rem] 2xl:grid-cols-[minmax(0,1fr)_24rem]">
        <section className="min-w-0 space-y-space-md">
          {isEmpty && emptyState ? (
            <div className="flex min-h-[min(24rem,calc(100vh-18rem))] flex-col items-center justify-center rounded-2xl border border-dashed border-outline-variant/45 bg-surface-container-low/35 px-space-lg py-space-xl text-center">
              <div className="mb-space-md flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-container-high text-primary shadow-sm">
                <MaterialSymbol name={emptyState.icon} className="text-[28px]" />
              </div>
              <p className="font-headline-sm text-headline-sm font-semibold text-on-surface">{emptyState.title}</p>
              <p className="mt-1 max-w-md text-sm leading-relaxed text-on-surface-variant">{emptyState.description}</p>
            </div>
          ) : null}
          {list}
        </section>

        <aside className="w-full xl:sticky xl:top-24">
          <div className="overflow-hidden rounded-2xl border border-surface-variant/70 bg-surface-container-lowest shadow-md ring-1 ring-surface-variant/30">
            <div className="border-b border-surface-variant/50 bg-surface-container-low/50 px-space-lg py-space-md">
              <div className="flex items-start gap-space-sm">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-container text-on-primary">
                  <MaterialSymbol name={asideIcon} className="text-[20px]" />
                </span>
                <div>
                  <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">{asideTitle}</h3>
                  <p className="mt-0.5 text-xs text-on-surface-variant">{asideHint}</p>
                </div>
              </div>
            </div>
            <div className="px-space-lg py-space-md">{aside}</div>
          </div>
        </aside>
      </div>
    </Wrapper>
  );
}