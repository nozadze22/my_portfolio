import { z } from "zod";

export const employmentTypeSchema = z.enum([
  "REMOTE",
  "FULL_TIME",
  "PART_TIME",
  "OTHER",
  "CONTRACT",
  "FREELANCE",
  "INTERNSHIP",
]);

export type EmploymentType = z.infer<typeof employmentTypeSchema>;

export const employmentTypeOptionsResponseSchema = z.object({
  data: z.array(
    z.object({
      value: employmentTypeSchema,
      label: z.string(),
    }),
  ),
});

export type EmploymentTypeOption = z.infer<
  typeof employmentTypeOptionsResponseSchema
>["data"][number];