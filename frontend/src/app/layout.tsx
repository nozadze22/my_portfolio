import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";

import { TanStackPathHint } from "@/components/tanstack-path-hint";
import { TanStackRouterApp } from "@/providers/tanstack-router-app";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Personal portfolio — Next.js + TanStack Router",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <TanStackRouterApp />
        <Suspense fallback={null}>
          <TanStackPathHint />
        </Suspense>
        {children}
      </body>
    </html>
  );
}