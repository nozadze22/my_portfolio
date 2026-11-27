import { createFileRoute, Link } from "@tanstack/react-router";

import { PageChrome } from "@/components/layout/page-chrome";
import { FadeIn } from "@/app/components/motion/fade-in";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <PageChrome
      tone="site"
      breadcrumb={["Portfolio", "About"]}
      title="About this site"
      description="TanStack Router for navigation, Motion for subtle entrances, and a single Nest API for all portfolio data."
      actions={
        <Link
          to="/"
          className="inline-flex items-center rounded-lg bg-surface-container-high px-space-md py-2 font-body-sm text-body-sm font-semibold text-primary transition-colors hover:bg-surface-variant"
        >
          Back to home
        </Link>
      }
    >
      <FadeIn>
        <div className="max-w-2xl space-y-space-md rounded-xl border border-surface-variant bg-surface-container-lowest p-space-lg shadow-sm">
          <p className="font-body-md leading-relaxed text-on-surface-variant">
            ეს გვერდი იყენებს TanStack Router-ს ნავიგაციისთვის და Motion-ს გვერდის შესვლის ანიმაციისთვის. იგივე{" "}
            <code className="rounded bg-surface-container-low px-1 font-label-code text-label-code">PageChrome</code>{" "}
            wrapper-ი რაც admin დაშბორდზეა — ერთიანი typography და spacing.
          </p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Home-ზე დარჩა სექციებად (SectionShell + SectionHeader); standalone გვერდებზე — PageChrome tone=&quot;site&quot;.
          </p>
        </div>
      </FadeIn>
    </PageChrome>
  );
}