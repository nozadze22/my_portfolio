import type { ReactNode } from "react";

import Wrapper from "@/components/shared/wrapper";

export type SectionShellProps = {
  id: string;
  children: ReactNode;
  className?: string;
  /** Narrower inner width, e.g. `max-w-5xl` */
  containerClassName?: string;
};

/** Full-width portfolio section with consistent vertical rhythm. */
export function SectionShell({
  id,
  children,
  className = "bg-surface-container-lowest",
  containerClassName,
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={`w-full border-t border-surface-variant/40 py-space-xl lg:py-24 ${className}`}
    >
      <Wrapper className={containerClassName}>{children}</Wrapper>
    </section>
  );
}