/** Accepts `yyyy-MM-dd` or full ISO-8601 strings for Prisma `DateTime` fields. */
export function parseDateOnly(value: string | undefined): Date | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return new Date(`${trimmed}T00:00:00.000Z`);
  }
  const d = new Date(trimmed);
  return Number.isNaN(d.getTime()) ? undefined : d;
}