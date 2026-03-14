// SPDX-License-Identifier: MIT
// apps/demo — 404 page content: message, illustration, Back and Home actions.

"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GlassCard } from "@novasphere/ui-glass";
import { ArrowLeft, Home } from "lucide-react";

/**
 * 404 content block: illustration, message, and Back / Home actions.
 * Rendered inside the application shell by not-found.tsx.
 */
export default function NotFoundContent(): React.ReactElement {
  const router = useRouter();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 md:p-6">
      <GlassCard variant="medium" className="w-full max-w-md overflow-hidden">
        <div className="flex flex-col items-center px-6 py-10 text-center md:px-10 md:py-12">
          {/* 404 illustration: geometric numerals + lost-path accent */}
          <div
            className="mb-6 flex justify-center md:mb-8"
            aria-hidden
          >
            <svg
              viewBox="0 0 220 100"
              className="h-24 w-auto md:h-32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* "4" — vertical, horizontal bar, diagonal */}
              <path
                d="M42 22v56M42 50H18l24-28"
                stroke="var(--ns-color-accent)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity="0.8"
              />
              {/* "0" — dashed circle (empty / missing) */}
              <circle
                cx="95"
                cy="50"
                r="26"
                stroke="var(--ns-color-accent)"
                strokeWidth="4"
                strokeOpacity="0.5"
                strokeDasharray="6 5"
                fill="none"
              />
              {/* "4" — second digit */}
              <path
                d="M152 22v56M152 50h-24l24-28"
                stroke="var(--ns-color-accent)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity="0.8"
              />
              {/* Floating "lost" element */}
              <circle
                cx="200"
                cy="80"
                r="6"
                fill="var(--ns-color-accent)"
                opacity="0.5"
              />
            </svg>
          </div>

          <h1 className="mb-2 text-2xl font-semibold tracking-tight text-white/95 md:text-3xl">
            Page not found
          </h1>
          <p className="mb-8 max-w-sm text-sm text-white/60 md:text-base">
            This page might have moved, or the link could be broken. Head back or start from home.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-ns-border bg-ns-surface/80 px-4 py-2 text-sm font-medium text-ns-text shadow-sm backdrop-blur-sm transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ns-accent"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back
            </button>
            <Link
              href="/demo/dashboard"
              className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-ns-accent px-4 py-2 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ns-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ns-color-bg)]"
              aria-label="Go to dashboard home"
            >
              <Home className="h-4 w-4" aria-hidden />
              Home
            </Link>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
