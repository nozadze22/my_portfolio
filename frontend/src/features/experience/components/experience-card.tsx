import { formatEmploymentType } from "../lib/employment-type-labels";
import type { Experience } from "../schema/experience.schema";
import { formatExperiencePeriod } from "./experience-utils";

export function ExperienceCard({ exp, accent }: { exp: Experience; accent: boolean }) {
  const border = accent ? "border-primary" : "border-outline-variant";
  const periodColor = accent ? "text-primary" : "text-on-surface-variant";
  const tagColor = accent ? "text-primary" : "text-on-surface-variant";

  return (
    <article className="group relative">
      <TimelineDot borderClass={border} />
      <div className="absolute top-2 -left-44 hidden w-32 text-right md:block">
        <span className={`font-label-badge uppercase font-semibold ${periodColor}`}>
          {formatExperiencePeriod(exp)}
        </span>
        {formatEmploymentType(exp.employmentType) ? (
          <span className="block font-label-code text-[11px] text-on-surface-variant">
            {formatEmploymentType(exp.employmentType)}
          </span>
        ) : null}
      </div>
      <div className="rounded-2xl border border-surface-variant bg-surface-container-lowest p-space-lg shadow-sm transition-all hover:border-primary-fixed-dim hover:shadow-md">
        <div className="mb-space-xs flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-headline-sm text-on-surface">{exp.position}</h3>
          <span className={`font-label-badge uppercase md:hidden ${periodColor}`}>
            {formatExperiencePeriod(exp)}
          </span>
        </div>
        <p className="mb-space-sm font-label-code text-secondary">
          {exp.company}
          {exp.location ? ` · ${exp.location}` : ""}
        </p>
        <p className="mb-space-md text-body-md leading-relaxed text-on-surface-variant">{exp.description}</p>
        <TagRow
          tags={[...(exp.skills?.map((s) => s.name) ?? []), ...exp.technologies.slice(0, 4)]}
          tagColor={tagColor}
        />
      </div>
    </article>
  );
}

function TimelineDot({ borderClass }: { borderClass: string }) {
  return (
    <div
      className={`absolute top-1.5 -left-[31px] flex h-6 w-6 items-center justify-center rounded-full border-4 bg-surface-container-lowest shadow-sm md:-left-[47px] ${borderClass}`}
    />
  );
}

function TagRow({ tags, tagColor }: { tags: string[]; tagColor: string }) {
  if (tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((t) => (
        <span
          key={t}
          className={`rounded-md bg-surface-container-low px-2.5 py-1 font-label-code text-[11px] ${tagColor}`}
        >
          {t}
        </span>
      ))}
    </div>
  );
}