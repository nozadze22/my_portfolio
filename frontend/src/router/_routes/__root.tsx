import { createRootRoute } from "@tanstack/react-router";

import { AnimatedOutlet } from "@/components/motion/animated-outlet";
import { MotionNavLink } from "@/components/motion/nav-link";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="flex min-h-full flex-col bg-zinc-50 font-sans text-zinc-900 dark:bg-black dark:text-zinc-50">
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-black/80">
        <nav className="mx-auto flex max-w-3xl items-center gap-8 px-6 py-4 text-sm font-medium">
          <MotionNavLink to="/">Home</MotionNavLink>
          <MotionNavLink to="/about">About</MotionNavLink>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <AnimatedOutlet />
      </main>
    </div>
  );
}