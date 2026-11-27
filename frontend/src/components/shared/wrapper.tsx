import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type WrapperProps = {
  children: ReactNode;
  className?: string;
  /** `admin` = full width of main (beside sidebar); `site` = capped max width */
  variant?: "site" | "admin";
};

/** Constrains page width on large displays — use inside full-bleed sections/headers. */
function Wrapper({ children, className, variant = "site" }: WrapperProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-7 lg:px-8",
        variant === "admin" ? "max-w-none" : "max-w-page",
        className,
      )}
    >
      {children}
    </div>
  );
}

export { Wrapper };
export default Wrapper;