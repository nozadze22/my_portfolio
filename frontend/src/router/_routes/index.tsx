import { createFileRoute } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";

import { FadeIn } from "@/components/motion/fade-in";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="space-y-10">
      <FadeIn>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
          Portfolio
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          გამარჯობა — აქ იწყება შენი საიტი
        </h1>
      </FadeIn>

      <FadeIn delay={0.08}>
        <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Next.js + TanStack Router + Motion. დაამატე პროექტები და სექციები{" "}
          <code className="rounded bg-zinc-200/80 px-1.5 py-0.5 font-mono text-sm dark:bg-zinc-800">
            src/router/_routes
          </code>
          .
        </p>
      </FadeIn>

      <FadeIn delay={0.16}>
        <div className="grid gap-4 sm:grid-cols-2">
          {["Projects", "Contact"].map((label, index) => (
            <motion.div
              key={label}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduceMotion ? 0 : 0.22 + index * 0.08, duration: 0.5 }}
              whileHover={
                reduceMotion
                  ? undefined
                  : { y: -4, transition: { duration: 0.2 } }
              }
            >
              <h2 className="text-lg font-medium">{label}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                მალე დაემატება — ბარათები უკვე Motion-ით ანიმირებულია.
              </p>
            </motion.div>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}