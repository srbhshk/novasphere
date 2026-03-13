// SPDX-License-Identifier: MIT
// @novasphere/ui-bento — BentoGrid
// Data-driven grid that renders cards from layout config; supports drag-to-reorder.

"use client";

import * as React from "react";
import { Reorder } from "framer-motion";
import { cn } from "../lib/utils";
import BentoCard from "../BentoCard";
import type {
  BentoLayoutConfig,
  BentoCardConfig,
  BentoCardModuleProps,
} from "../bento.types";

export type BentoGridProps = {
  /** Full layout config (visible cards are filtered and sorted by order). */
  layout: BentoLayoutConfig;
  /** Map of moduleId to component; each receives BentoCardModuleProps. */
  modules: Record<string, React.ComponentType<BentoCardModuleProps>>;
  /** Called when user finishes drag with new order values. */
  onReorder?: (newLayout: BentoLayoutConfig) => void;
  className?: string;
};

/**
 * Renders a 12-column CSS Grid of Bento cards from layout config. Filters to
 * visible cards, sorts by order, and supports drag-to-reorder via Framer Motion.
 */
export default function BentoGrid({
  layout,
  modules,
  onReorder,
  className,
}: BentoGridProps): JSX.Element {
  const visibleCards = React.useMemo(
    () =>
      [...layout]
        .filter((c) => c.visible)
        .sort((a, b) => a.order - b.order),
    [layout]
  );

  const handleReorder = React.useCallback(
    (newOrder: BentoCardConfig[]) => {
      if (!onReorder) return;
      const orderById = new Map(newOrder.map((c, i) => [c.id, i]));
      const newLayout: BentoLayoutConfig = layout.map((c) =>
        orderById.has(c.id) ? { ...c, order: orderById.get(c.id) ?? c.order } : c
      );
      onReorder(newLayout);
    },
    [layout, onReorder]
  );

  const gridClassName = cn(
    "grid w-full gap-4",
    "grid-cols-1 md:grid-cols-6 lg:grid-cols-12",
    className
  );

  const renderCard = (config: BentoCardConfig, isDragging?: boolean): React.ReactNode => {
    const Module = modules[config.moduleId];
    return (
      <BentoCard config={config} isDragging={isDragging ?? false}>
        {Module ? <Module config={config} /> : <span>{config.moduleId}</span>}
      </BentoCard>
    );
  };

  if (onReorder && visibleCards.length > 0) {
    return (
      <Reorder.Group
        as="div"
        values={visibleCards}
        onReorder={handleReorder}
        className={gridClassName}
        style={{ gridTemplateColumns: "repeat(12, minmax(0, 1fr))" }}
      >
        {visibleCards.map((config: BentoCardConfig) => (
          <Reorder.Item
            as="div"
            key={config.id}
            value={config}
            className="min-h-0 cursor-grab active:cursor-grabbing"
            style={{
              gridColumn: `span ${config.colSpan}`,
              gridRow: `span ${config.rowSpan}`,
            }}
            whileDrag={{
              scale: 1.02,
              boxShadow: "0 12px 40px rgba(0, 0, 0, 0.35)",
              cursor: "grabbing",
            }}
          >
            {renderCard(config)}
          </Reorder.Item>
        ))}
      </Reorder.Group>
    );
  }

  return (
    <div className={gridClassName} style={{ gridTemplateColumns: "repeat(12, minmax(0, 1fr))" }}>
      {visibleCards.map((config: BentoCardConfig) => (
        <div
          key={config.id}
          className="min-h-0"
          style={{
            gridColumn: `span ${config.colSpan}`,
            gridRow: `span ${config.rowSpan}`,
          }}
        >
          {renderCard(config)}
        </div>
      ))}
    </div>
  );
}
