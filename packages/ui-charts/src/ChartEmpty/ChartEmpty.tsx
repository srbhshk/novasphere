// SPDX-License-Identifier: MIT
// @novasphere/ui-charts — ChartEmpty
// Empty state message for charts when no data.

import { cn } from "../lib/utils";

export type ChartEmptyProps = {
  /** Optional class name. */
  className?: string;
  /** Message (default "No data"). */
  message?: string;
};

export default function ChartEmpty({
  className,
  message = "No data",
}: ChartEmptyProps): JSX.Element {
  return (
    <div
      className={cn(
        "flex items-center justify-center min-h-[80px] text-sm",
        "[color:var(--ns-color-muted)]",
        className
      )}
      role="status"
      aria-label={message}
    >
      {message}
    </div>
  );
}
