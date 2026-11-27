import { MaterialSymbol } from "@/components/ui/material-symbol";
import { formatDisplayMonthYear } from "@/lib/format-display-date";
import type { Education } from "../schema/education.schema";

export function formatEducationDates(edu: Education) {
  const start = formatDisplayMonthYear(edu.startDate);
  const end = edu.current
    ? "Present"
    : edu.endDate
      ? formatDisplayMonthYear(edu.endDate)
      : "";
  return `${start} — ${end}`;
}

export function EducationCard({ edu }: { edu: Education }) {
  const subtitle = [edu.degree, edu.fieldOfStudy].filter(Boolean).join(" · ");

  return (
    <article className="flex h-full flex-col rounded-2xl border border-surface-variant bg-surface-container-lowest p-space-lg shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      {edu.featured ? (
        <span className="mb-space-sm inline-flex w-fit rounded-full bg-primary-fixed px-2 py-0.5 font-label-badge text-[10px] text-primary">
          Featured
        </span>
      ) : null}
      <div className="mb-space-xs flex items-start justify-between gap-2">
        <h3 className="font-headline-sm text-on-surface">{edu.institution}</h3>
        <span className="shrink-0 font-label-code text-xs text-primary">{formatEducationDates(edu)}</span>
      </div>
      {subtitle ? <p className="mb-space-sm font-label-code text-sm text-secondary">{subtitle}</p> : null}
      {edu.location ? (
        <p className="mb-space-sm flex items-center gap-1 text-sm text-on-surface-variant">
          <MaterialSymbol name="location_on" className="text-[16px]" />
          {edu.location}
        </p>
      ) : null}
      {edu.description ? (
        <p className="mb-space-md flex-1 text-sm leading-relaxed text-on-surface-variant">{edu.description}</p>
      ) : null}
      {edu.skills && edu.skills.length > 0 ? <EducationSkillChips skills={edu.skills} /> : null}
    </article>
  );
}

function EducationSkillChips({ skills }: { skills: { id: string; name: string }[] }) {
  return (
    <div className="mt-auto flex flex-wrap gap-1.5 border-t border-surface-variant/60 pt-space-sm">
      {skills.map((s) => (
        <span
          key={s.id}
          className="rounded-full border border-surface-variant bg-surface-container-low px-2 py-0.5 font-label-code text-[11px]"
        >
          {s.name}
        </span>
      ))}
    </div>
  );
}