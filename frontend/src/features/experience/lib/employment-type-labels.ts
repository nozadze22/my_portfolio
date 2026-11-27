import type { EmploymentType } from "../schema/employment-type.schema";

/** Display fallback — API `/experience/employment-types` is source of truth for forms. */
export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  REMOTE: "Remote",
  FULL_TIME: "Full time",
  PART_TIME: "Part time",
  OTHER: "Other",
  CONTRACT: "Contract",
  FREELANCE: "Freelance",
  INTERNSHIP: "Internship",
};

export function formatEmploymentType(type: EmploymentType | null | undefined): string | null {
  if (!type) return null;
  return EMPLOYMENT_TYPE_LABELS[type] ?? type.replaceAll("_", " ").toLowerCase();
}