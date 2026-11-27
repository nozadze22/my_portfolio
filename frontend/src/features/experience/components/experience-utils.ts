import { formatDisplayMonthYear } from "@/lib/format-display-date";
import type { Experience } from "../schema/experience.schema";

export function formatExperiencePeriod(exp: Experience) {
  const start = formatDisplayMonthYear(exp.startDate);
  const end = exp.current
    ? "Present"
    : exp.endDate
      ? formatDisplayMonthYear(exp.endDate)
      : "";
  return `${start} — ${end}`;
}