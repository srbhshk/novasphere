// SPDX-License-Identifier: MIT
// apps/demo — ContextBanner
// Shown when agent detects an anomaly; displays message with Investigate / Dismiss actions.

"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Search } from "lucide-react";
import { GlassCard } from "@novasphere/ui-glass";

export type ContextBannerProps = {
  /** Anomaly message to display; when null, banner is hidden. */
  message: string | null;
  /** Called when user dismisses the banner. */
  onDismiss: () => void;
  /** Called when user taps Investigate (e.g. open copilot with follow-up message). */
  onInvestigate: () => void;
};

const bannerVariants = {
  hidden: { opacity: 0, y: -12 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

/**
 * Context banner shown when the agent detects an anomaly. Displays the message
 * with Investigate (sends follow-up to copilot) and Dismiss actions.
 */
export default function ContextBanner({
  message,
  onDismiss,
  onInvestigate,
}: ContextBannerProps): React.ReactElement | null {
  if (message === null || message === "") return null;

  return (
    <AnimatePresence>
      <motion.div
        role="alert"
        aria-live="polite"
        className="fixed left-4 right-4 top-4 z-40 md:left-6 md:right-auto md:max-w-md"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={bannerVariants}
        transition={{ duration: 0.2 }}
      >
        <GlassCard variant="strong" className="overflow-hidden rounded-xl border border-amber-500/30">
          <div className="flex items-start gap-3 p-4">
            <AlertTriangle
              className="h-5 w-5 shrink-0 text-amber-500"
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ns-text">Anomaly detected</p>
              <p className="mt-1 text-sm text-ns-muted">{message}</p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={onInvestigate}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-ns-accent px-3 py-1.5 text-sm font-medium text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ns-accent"
                  aria-label="Investigate in copilot"
                >
                  <Search className="h-4 w-4" />
                  Investigate
                </button>
                <button
                  type="button"
                  onClick={onDismiss}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-ns-border bg-ns-surface/80 px-3 py-1.5 text-sm text-ns-text hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ns-border-hi"
                  aria-label="Dismiss"
                >
                  <X className="h-4 w-4" />
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </AnimatePresence>
  );
}
