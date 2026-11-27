import type { ReactNode } from "react";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import Wrapper from "@/components/shared/wrapper";

export type PageChromeProps = {
  breadcrumb?: string[];
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  /** Admin dashboard vs marketing / inner site pages */
  tone?: "admin" | "site";
};

export function PageChrome({
  breadcrumb = [],
  title,
  description,
  actions,
  children,
  tone = "admin",
}: PageChromeProps) {
  const isAdmin = tone === "admin";

  return (
    <div className={isAdmin ? "flex w-full flex-col pb-margin" : "flex w-full flex-col"}>
      <div
        className={
          isAdmin
            ? "flex flex-col gap-space-md bg-surface-container-lowest pb-space-md pt-space-lg shadow-sm"
            : "border-b border-surface-variant/60 bg-surface-container-low/40"
        }
      >
        <Wrapper
          variant={isAdmin ? "admin" : "site"}
          className={
            isAdmin
              ? "flex flex-col gap-space-md"
              : "flex flex-col gap-space-md py-space-lg"
          }
        >
          {breadcrumb.length > 0 ? (
            <nav className="flex flex-wrap items-center gap-space-xs font-label-code text-label-code text-on-surface-variant">
              {breadcrumb.map((part, i) => (
                <span key={`${part}-${i}`} className="flex items-center gap-space-xs">
                  {i > 0 ? <MaterialSymbol name="chevron_right" className="text-[14px]" /> : null}
                  <span className={i === breadcrumb.length - 1 ? "font-semibold text-primary" : undefined}>
                    {part}
                  </span>
                </span>
              ))}
            </nav>
          ) : null}
          <div className="flex flex-col justify-between gap-space-md lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <h1 className="font-headline-lg text-headline-lg tracking-tight text-on-surface">{title}</h1>
              {description ? (
                <p className="mt-1 font-body-md text-body-md text-on-surface-variant">{description}</p>
              ) : null}
            </div>
            {actions ? <div className="flex flex-wrap items-center gap-space-sm">{actions}</div> : null}
          </div>
        </Wrapper>
      </div>
      <Wrapper
        variant={isAdmin ? "admin" : "site"}
        className={
          isAdmin
            ? "mt-space-lg flex min-h-[calc(100vh-12rem)] w-full flex-col gap-space-xl"
            : "flex flex-col gap-space-xl py-space-lg"
        }
      >
        {children}
      </Wrapper>
    </div>
  );
}