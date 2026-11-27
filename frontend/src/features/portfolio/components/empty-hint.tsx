import { MaterialSymbol } from "@/components/ui/material-symbol";

type EmptyHintProps = {
  icon?: string;
  title: string;
  hint: string;
};

export function EmptyHint({
  icon = "inbox",
  title,
  hint,
}: EmptyHintProps) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-surface-variant bg-surface-container-low/50 px-space-lg py-space-xl text-center">
      <h3 className="flex items-center gap-2 font-headline-sm text-on-surface">
        <MaterialSymbol name={icon} className="text-primary" />
        {title}
      </h3>
      <p className="mt-space-sm max-w-md text-sm text-on-surface-variant">{hint}</p>
    </div>
  );
}