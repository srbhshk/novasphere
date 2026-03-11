// SPDX-License-Identifier: MIT
// @novasphere/ui-bento — BentoCard
// Single card in the Bento grid; wraps content in GlassCard and applies grid span.

"use client";

import * as React from "react";
import { GlassCard } from "@novasphere/ui-glass";
import { cn } from "../lib/utils";
import type { BentoCardConfig } from "../bento.types";
import styles from "./BentoCard.module.css";

export type BentoCardProps = {
  /** Card configuration (id, colSpan, rowSpan, etc.). */
  config: BentoCardConfig;
  /** Card content (typically the resolved module component). */
  children: React.ReactNode;
  /** When true, applies dragging visual state (scale, shadow, cursor). */
  isDragging?: boolean;
};

/**
 * Renders a single Bento card with GlassCard and grid span. Used by BentoGrid
 * for each visible card; drag state is applied when isDragging is true.
 */
export default function BentoCard({
  config,
  children,
  isDragging = false,
}: BentoCardProps): JSX.Element {
  return (
    <GlassCard variant="medium" className={cn(styles.bentoCard, isDragging && styles.dragging)}>
      <div data-bento-card-id={config.id} className="h-full min-h-0 flex flex-col">
        {children}
      </div>
    </GlassCard>
  );
}
