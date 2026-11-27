import { createFileRoute } from "@tanstack/react-router";

import { FadeIn } from "@/features/components/motion/fade-in";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <section className="space-y-6">
      <FadeIn>
        <h1 className="text-3xl font-semibold tracking-tight">About</h1>
      </FadeIn>
      <FadeIn delay={0.1}>
        <p className="max-w-2xl leading-8 text-zinc-600 dark:text-zinc-400">
          ეს გვერდი იყენებს TanStack Router-ს ნავიგაციისთვის და Motion-ს გვერდის
          შესვლის ანიმაციისთვის. გადაიარე Home ↔ About და დაინახავ გადასვლას.
        </p>
      </FadeIn>
    </section>
  );
}