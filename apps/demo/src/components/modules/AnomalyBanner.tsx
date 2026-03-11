// SPDX-License-Identifier: MIT
// apps/demo — Bento module: full-width urgent anomaly banner with primary actions.

"use client";

import { AlertTriangle } from "lucide-react";
import type { BentoCardModuleProps } from "@novasphere/ui-bento";

type AnomalyBannerConfig = BentoCardModuleProps["config"] & {
  /** Optional message attached by the agent when an anomaly is detected. */
  anomalyMessage?: string;
};

const DEFAULT_MESSAGE =
  "Revenue spike detected in APAC region — 34% above baseline";

export default function AnomalyBanner({
  config,
}: BentoCardModuleProps): JSX.Element {
  // Safe local extension of config for metadata without changing core BentoCardConfig.
  const extended = config as AnomalyBannerConfig;
  const message = extended.anomalyMessage ?? DEFAULT_MESSAGE;

  return (
    <div className="flex h-full items-center justify-between gap-4 rounded-xl border border-amber-500/60 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent px-4 py-3 shadow-[0_0_0_1px_rgba(248,179,51,0.4)] animate-pulse">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
          <AlertTriangle className="h-5 w-5" aria-hidden />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-amber-100">
            Anomaly Detected
          </h3>
          <p className="text-sm text-amber-50/90">{message}</p>
        </div>
      </div>
      <div className="flex flex-shrink-0 items-center gap-2">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full bg-amber-500 px-3.5 py-1.5 text-xs font-semibold text-black shadow-md shadow-amber-500/40 transition hover:bg-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
        >
          Investigate →
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-amber-400/60 bg-transparent px-3 py-1.5 text-xs font-medium text-amber-200 hover:bg-amber-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

