import type { ReactNode } from "react";

type SectionShellProps = {
  id: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
};

export function SectionShell({
  id,
  children,
  className = "bg-surface-container-lowest",
  containerClassName = "max-w-7xl",
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={`w-full border-t border-surface-variant/40 py-space-xl lg:py-24 ${className}`}
    >
      <div className={`mx-auto px-gutter ${containerClassName}`}>{children}</div>
    </section>
  );
}