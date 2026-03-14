// SPDX-License-Identifier: MIT
// @novasphere/ui-shell — BreadcrumbBar
// Renders a list of breadcrumb links. Last item is current page (no link).

import type { ReactElement } from "react";
import { cn } from "../lib/utils";
import styles from "./BreadcrumbBar.module.css";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export type BreadcrumbBarProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export default function BreadcrumbBar({
  items,
  className,
}: BreadcrumbBarProps): ReactElement {
  if (items.length === 0) return <nav aria-label="Breadcrumb" />;

  return (
    <nav aria-label="Breadcrumb" className={cn(styles.breadcrumb, className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={index} className={styles.breadcrumbItem}>
            {item.href != null && !isLast ? (
              <a href={item.href} className={styles.breadcrumbLink}>
                {item.label}
              </a>
            ) : (
              <span
                className={isLast ? styles.breadcrumbCurrent : undefined}
                aria-current={isLast ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
