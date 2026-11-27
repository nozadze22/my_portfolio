import type { ReactNode } from "react";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import Wrapper from "@/components/shared/wrapper";
import { cn } from "@/lib/utils";

type AdminFullFormPageProps = {
  formTitle: string;
  formHint?: string;
  formIcon?: string;
  form: ReactNode;
  recordsTitle?: string;
  records?: ReactNode;
  className?: string;
};

/** Full-width form card + records section inside Wrapper (`max-w-page`). */
export function AdminFullFormPage({
  formTitle,
  formHint = "Required fields are marked with *",
  formIcon = "edit_note",
  form,
  recordsTitle = "Saved records",
  records,
  className,
}: AdminFullFormPageProps) {
  return (
    <Wrapper variant="admin" className={cn("w-full max-w-page space-y-space-xl px-0 sm:px-0 lg:px-0", className)}>
      <section className="overflow-hidden rounded-2xl border border-surface-variant/70 bg-surface-container-lowest shadow-md ring-1 ring-surface-variant/25">
        <div className="border-b border-surface-variant/50 bg-surface-container-low/45 px-space-lg py-space-md sm:px-space-xl">
          <div className="flex items-start gap-space-sm">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-container text-on-primary shadow-sm">
              <MaterialSymbol name={formIcon} className="text-[22px]" />
            </span>
            <div>
              <h2 className="font-headline-sm text-headline-sm font-semibold text-on-surface">{formTitle}</h2>
              <p className="mt-0.5 text-xs text-on-surface-variant">{formHint}</p>
            </div>
          </div>
        </div>
        <div className="px-space-lg py-space-lg sm:px-space-xl sm:py-space-xl">{form}</div>
      </section>

      {records ? (
        <section className="space-y-space-md">
          <h3 className="font-label-code text-label-code uppercase tracking-wider text-on-surface-variant">
            {recordsTitle}
          </h3>
          {records}
        </section>
      ) : null}
    </Wrapper>
  );
}