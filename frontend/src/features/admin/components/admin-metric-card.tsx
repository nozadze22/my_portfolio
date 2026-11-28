import { MaterialSymbol } from "@/components/ui/material-symbol";

export function AdminMetricCard({
  label,
  value,
  hint,
  icon,
  fillIcon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: string;
  fillIcon?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
      <div>
        <span className="font-label-badge text-label-badge uppercase tracking-wider text-on-surface-variant">
          {label}
        </span>
        <div className="mt-1 font-display-hero-mobile text-display-hero-mobile text-on-surface">{value}</div>
        {hint ? <span className="font-label-code text-label-code text-on-surface-variant">{hint}</span> : null}
      </div>
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-container-low text-primary">
        <MaterialSymbol
          name={icon}
          className="text-[26px]"
          fill={fillIcon}
        />
      </div>
    </div>
  );
}