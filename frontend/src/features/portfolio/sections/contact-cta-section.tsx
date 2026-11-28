"use client";

import { Link } from "@tanstack/react-router";
import Wrapper from "@/components/shared/wrapper";
import { MaterialSymbol } from "@/components/ui/material-symbol";

export function ContactCtaSection() {
  return (
    <section className="w-full border-t border-surface-variant/40 bg-gradient-to-b from-surface-container-low to-surface-container-lowest py-space-xl lg:py-24">
      <Wrapper>
        <div className="relative overflow-hidden rounded-3xl border border-surface-variant/50 bg-surface-container-lowest px-8 py-12 text-center shadow-lg ring-1 ring-primary/10 sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary-container/20 blur-2xl" />
          <MaterialSymbol name="mail" className="mx-auto text-[40px] text-primary" />
          <h2 className="mt-4 font-headline-lg text-on-surface">Ready to talk?</h2>
          <p className="mx-auto mt-3 max-w-md text-on-surface-variant">
            Questions, freelance work, or just a hello — I&apos;d love to hear from you on the contact page.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary-container px-8 py-3.5 font-semibold text-on-primary shadow-md transition hover:bg-primary"
          >
            <MaterialSymbol name="chat_bubble" className="text-[20px]" />
            Go to contact page
          </Link>
        </div>
      </Wrapper>
    </section>
  );
}