import type { ReactNode } from "react";

type SectionHeaderProps = {
  badge: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  action?: ReactNode;
};

export function SectionHeader({
  badge,
  title,
  description,
  align = "center",
  action,
}: SectionHeaderProps) {
  const alignClass =
    align === "center"
      ? "mx-auto max-w-3xl items-center text-center"
      : "max-w-2xl items-start text-left";

  return (
    <div className="mb-space-xl flex w-full flex-col justify-between gap-space-md md:flex-row md:items-end">
      <div className={`flex flex-col ${alignClass}`}>
        <span className="mb-space-xs inline-flex w-fit rounded-full bg-surface-container-high px-space-sm py-1 font-label-badge text-label-badge uppercase tracking-wider text-primary">
          {badge}
        </span>
        <h2 className="mb-space-sm font-headline-lg text-headline-lg text-on-surface">{title}</h2>
        {description ? (
          <p className="font-body-md text-body-md text-on-surface-variant">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}