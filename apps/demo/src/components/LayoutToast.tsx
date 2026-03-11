// SPDX-License-Identifier: MIT
// apps/demo — LayoutToast: animated toast shown when Nova restructures the dashboard.

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { GlassCard } from "@novasphere/ui-glass";

export type LayoutToastProps = {
  message: string | null;
  onDismiss: () => void;
};

export default function LayoutToast({
  message,
  onDismiss,
}: LayoutToastProps): JSX.Element | null {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          key="layout-toast"
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="fixed right-4 top-4 z-40 md:right-6 md:top-6"
          role="status"
          aria-live="polite"
          onClick={onDismiss}
        >
          <GlassCard variant="strong" className="cursor-pointer px-4 py-2 text-sm text-ns-text">
            ✦ {message}
          </GlassCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

