import type { Experience } from "../schema/experience.schema";

export function formatExperiencePeriod(exp: Experience) {
  const start = exp.startDate.toLocaleDateString(undefined, { year: "numeric", month: "short" });
  const end = exp.current
    ? "Present"
    : exp.endDate
      ? exp.endDate.toLocaleDateString(undefined, { year: "numeric", month: "short" })
      : "";
  return `${start} — ${end}`;
}