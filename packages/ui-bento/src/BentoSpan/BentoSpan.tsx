// SPDX-License-Identifier: MIT
// @novasphere/ui-bento — BentoSpan
// Optional grid span placeholder for empty or custom grid cells.

import * as React from "react";
import { cn } from "../lib/utils";

export type BentoSpanProps = {
  /** Column span (1–12 in a 12-col grid). */
  colSpan?: number;
  /** Row span. */
  rowSpan?: number;
  children?: React.ReactNode;
  className?: string;
};

/**
 * A span wrapper for Bento grid cells when you need an empty or custom cell
 * without a full BentoCard.
 */
export default function BentoSpan({
  colSpan = 1,
  rowSpan = 1,
  children,
  className,
}: BentoSpanProps): React.ReactElement {
  return (
    <div
      className={cn("min-h-0", className)}
      style={{
        gridColumn: `span ${colSpan}`,
        gridRow: `span ${rowSpan}`,
      }}
    >
      {children}
    </div>
  );
}
