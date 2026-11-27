import type { RefinementCtx } from "zod";

type DateRangeFields = {
  current: boolean;
  startDate: string;
  endDate: string;
};

/** Zod superRefine: end date required when not current; optional chronological check. */
export function refineEndDateUnlessCurrent(
  data: DateRangeFields,
  ctx: RefinementCtx,
  messages: {
    endDateRequired: string;
    endBeforeStart?: string;
  },
) {
  if (!data.current && !data.endDate.trim()) {
    ctx.addIssue({
      code: "custom",
      message: messages.endDateRequired,
      path: ["endDate"],
    });
    return;
  }

  if (
    !data.current &&
    data.startDate.trim() &&
    data.endDate.trim() &&
    data.endDate < data.startDate
  ) {
    ctx.addIssue({
      code: "custom",
      message: messages.endBeforeStart ?? "End date must be on or after start date",
      path: ["endDate"],
    });
  }
}