const monthYear: Intl.DateTimeFormatOptions = { year: "numeric", month: "short" };

export function toDate(value: string | Date | null | undefined): Date | null {
  if (value == null || value === "") return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatDisplayMonthYear(value: string | Date | null | undefined): string {
  const d = toDate(value);
  return d ? d.toLocaleDateString(undefined, monthYear) : "";
}