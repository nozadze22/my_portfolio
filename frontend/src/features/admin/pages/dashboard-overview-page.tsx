"use client";

import { Link } from "@tanstack/react-router";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { AdminMetricCard } from "@/features/admin/components/admin-metric-card";
import { AdminPageChrome } from "@/features/admin/layout/admin-console-layout";
import { useEducationList } from "@/features/education/hooks/education";
import { useExperiences } from "@/features/experience/hooks/experience";
import { useGetProjects } from "@/features/projects/hooks/projects";
import { useSkills } from "@/features/skills/hooks/skills";
import { useAuthMe } from "@/features/auth/hooks/auth";

export function DashboardOverviewPage() {
  const { data: user } = useAuthMe();
  const projects = useGetProjects({ limit: 100, page: 1 });
  const education = useEducationList({ limit: 100 });
  const experience = useExperiences({ limit: 100 });
  const skills = useSkills({ limit: 100 });

  const projectList = projects.data?.data ?? [];
  const featured = projectList.filter((p) => p.featured).length;
  const eduTotal = education.data?.meta.total ?? 0;
  const expTotal = experience.data?.meta.total ?? 0;
  const skillTotal = skills.data?.meta.total ?? 0;

  return (
    <AdminPageChrome
      breadcrumb={["Admin Console", "Overview"]}
      title="Content & portfolio management"
      description="Manage case studies, skills, education, experience, and site profile. All changes sync to the public API."
      actions={
        <Link
          to="/admin/dashboard/projects"
          className="inline-flex items-center gap-space-xs rounded-lg bg-primary-container px-space-md py-2.5 font-body-sm text-body-sm font-semibold text-on-primary shadow-sm transition-all hover:bg-primary"
        >
          <MaterialSymbol name="add" className="text-[20px]" />
          New project
        </Link>
      }
    >
      <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2 xl:grid-cols-5">
        <AdminMetricCard
          label="Total projects"
          value={String(projects.data?.meta.total ?? projectList.length)}
          hint={`${featured} featured`}
          icon="terminal"
        />
        <AdminMetricCard
          label="Featured"
          value={String(featured)}
          hint="Shown on portfolio"
          icon="star"
          fillIcon
        />
        <AdminMetricCard label="Education" value={String(eduTotal)} hint="Credentials" icon="verified" />
        <AdminMetricCard label="Experience" value={String(expTotal)} hint="Roles" icon="work_history" />
        <AdminMetricCard label="Skills" value={String(skillTotal)} hint="Technologies" icon="psychology" />
      </div>

      <div className="grid gap-space-md sm:grid-cols-2 lg:grid-cols-3">
        {QUICK_LINKS.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="rounded-2xl border border-surface-variant bg-surface-container-lowest p-space-lg shadow-sm transition-all hover:border-primary hover:shadow-md"
          >
            <MaterialSymbol name={card.icon} className="mb-2 text-[28px] text-primary" />
            <h2 className="font-headline-sm text-on-surface">{card.title}</h2>
            <p className="mt-1 text-sm text-on-surface-variant">{card.desc}</p>
          </Link>
        ))}
      </div>

      <p className="font-body-sm text-body-sm text-on-surface-variant">
        Signed in as <strong className="text-on-surface">{user?.email}</strong> ({user?.role}).
      </p>
    </AdminPageChrome>
  );
}

const QUICK_LINKS = [
  {
    to: "/admin/dashboard/profile" as const,
    title: "Portfolio profile",
    desc: "Hero, about, links, availability",
    icon: "person",
  },
  {
    to: "/admin/dashboard/projects" as const,
    title: "Projects",
    desc: "Create, feature, and remove case studies",
    icon: "terminal",
  },
  {
    to: "/admin/dashboard/education" as const,
    title: "Education",
    desc: "Degrees and programs",
    icon: "school",
  },
  {
    to: "/admin/dashboard/experience" as const,
    title: "Experience",
    desc: "Jobs and roles",
    icon: "work_history",
  },
  {
    to: "/admin/dashboard/skills" as const,
    title: "Skills",
    desc: "Languages, tools, and stacks",
    icon: "psychology",
  },
];