type MaterialSymbolProps = {
  name: string;
  className?: string;
  fill?: boolean;
};

export function MaterialSymbol({ name, className, fill }: MaterialSymbolProps) {
  return (
    <span
      className={`material-symbols-outlined ${className ?? ""}`}
      style={fill ? { fontVariationSettings: "'FILL' 1" } : undefined}
      aria-hidden
    >
      {name}
    </span>
  );
}