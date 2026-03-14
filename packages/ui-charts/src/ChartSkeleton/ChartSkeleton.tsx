// SPDX-License-Identifier: MIT
// @novasphere/ui-charts — ChartSkeleton
// Loading placeholder at given dimensions for chart cards.

import type { ReactElement } from "react";
import styles from "./ChartSkeleton.module.css";

export type ChartSkeletonProps = {
  /** Chart width (default 100%). */
  width?: string | number;
  /** Chart height in px. */
  height: number;
  /** Optional class name. */
  className?: string;
};

export default function ChartSkeleton({
  width = "100%",
  height,
  className,
}: ChartSkeletonProps): ReactElement {
  return (
    <div
      className={className}
      role="status"
      aria-label="Loading chart"
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: `${height}px`,
      }}
    >
      <div className={styles.skeleton} />
    </div>
  );
}
