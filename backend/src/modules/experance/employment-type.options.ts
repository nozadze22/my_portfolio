import { EmploymentType } from "@prisma/client";

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  REMOTE: "Remote",
  FULL_TIME: "Full time",
  PART_TIME: "Part time",
  OTHER: "Other",
  CONTRACT: "Contract",
  FREELANCE: "Freelance",
  INTERNSHIP: "Internship",
};

/** Order shown in admin/public selects (API source of truth). */
export const EMPLOYMENT_TYPE_ORDER: EmploymentType[] = [
  EmploymentType.REMOTE,
  EmploymentType.FULL_TIME,
  EmploymentType.PART_TIME,
  EmploymentType.OTHER,
  EmploymentType.CONTRACT,
  EmploymentType.FREELANCE,
  EmploymentType.INTERNSHIP,
];

export function listEmploymentTypeOptions() {
  return EMPLOYMENT_TYPE_ORDER.map((value) => ({
    value,
    label: EMPLOYMENT_TYPE_LABELS[value],
  }));
}