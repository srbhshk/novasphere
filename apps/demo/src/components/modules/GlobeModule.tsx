// SPDX-License-Identifier: MIT
// apps/demo — Bento module: animated SVG globe with regional growth hotspots.

"use client";

import * as React from "react";
import type { BentoCardModuleProps } from "@novasphere/ui-bento";

export default function GlobeModule({
  config,
}: BentoCardModuleProps): React.ReactElement {
  const title = config.title ?? "Global Traffic";

  return (
    <div className="flex h-full flex-col rounded-xl border border-ns-border/60 bg-ns-surface/60 px-4 py-3">
      <h3 className="text-sm font-semibold text-ns-text">{title}</h3>
      <div className="mt-3 flex flex-1 flex-col items-center justify-center gap-4">
        <svg
          viewBox="0 0 200 200"
          className="h-32 w-32 text-ns-muted"
          aria-hidden
        >
          <defs>
            <radialGradient id="globeGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--ns-color-accent)" stopOpacity={0.9} />
              <stop offset="60%" stopColor="var(--ns-color-accent)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="var(--ns-color-bg)" stopOpacity={1} />
            </radialGradient>
          </defs>
          <circle
            cx="100"
            cy="100"
            r="70"
            fill="url(#globeGradient)"
            style={{ stroke: "var(--ns-color-border-hi)" }}
          />
          <ellipse
            cx="100"
            cy="100"
            rx="70"
            ry="26"
            fill="none"
            style={{ stroke: "var(--ns-color-border)" }}
          />
          <ellipse
            cx="100"
            cy="100"
            rx="40"
            ry="70"
            fill="none"
            style={{ stroke: "var(--ns-color-border)" }}
          />
          <path
            d="M40 85 C 80 60, 120 60, 160 85"
            fill="none"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="animate-pulse"
            style={{ stroke: "var(--ns-color-accent)", strokeOpacity: 0.5 }}
          />
          <path
            d="M50 120 C 95 140, 135 135, 155 115"
            fill="none"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="animate-pulse"
            style={{ stroke: "var(--ns-color-accent-2)", strokeOpacity: 0.7 }}
          />
          <circle
            cx="145"
            cy="70"
            r="4"
            className="animate-pulse"
            style={{ fill: "var(--ns-color-accent)" }}
          />
          <circle
            cx="70"
            cy="80"
            r="4"
            className="animate-pulse"
            style={{ fill: "var(--ns-color-accent-2)" }}
          />
          <circle
            cx="90"
            cy="135"
            r="4"
            className="animate-pulse"
            style={{ fill: "var(--ns-color-accent-3)" }}
          />
        </svg>
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/15 px-2 py-1 text-sky-300">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400" aria-hidden />
            APAC +34%
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/15 px-2 py-1 text-violet-300">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" aria-hidden />
            EMEA +12%
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-1 text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
            NA +8%
          </span>
        </div>
      </div>
    </div>
  );
}

