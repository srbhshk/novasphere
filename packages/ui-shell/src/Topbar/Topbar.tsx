// SPDX-License-Identifier: MIT
// @novasphere/ui-shell — Topbar
// Renders tenant name, breadcrumb, and right-side actions. Uses GlassPanel.

import * as React from "react";
import type { TenantConfig } from "@novasphere/tenant-core";
import { GlassPanel } from "@novasphere/ui-glass";
import { BreadcrumbBar } from "../BreadcrumbBar";
import type { BreadcrumbItem } from "../BreadcrumbBar";
import styles from "./Topbar.module.css";

export type TopbarProps = {
  tenant: TenantConfig;
  title: string;
  /** Optional breadcrumb items (defaults to single item with title). */
  breadcrumbs?: BreadcrumbItem[];
  /** Optional slot for right-side actions (buttons + avatar). */
  rightSlot?: React.ReactNode;
};

export default function Topbar({
  tenant,
  title,
  breadcrumbs,
  rightSlot,
}: TopbarProps): JSX.Element {
  const items: BreadcrumbItem[] =
    breadcrumbs != null && breadcrumbs.length > 0
      ? breadcrumbs
      : [{ label: title }];

  return (
    <header className={styles.topbarRoot} role="banner">
      <GlassPanel
        variant="subtle"
        {...(styles.topbarPanel ? { className: styles.topbarPanel } : {})}
      >
        <div className={styles.topbar}>
          <div className={styles.left}>
            <span className={styles.tenantName}>{tenant.name}</span>
            <span className={styles.separator} aria-hidden />
            <BreadcrumbBar items={items} />
          </div>
          {rightSlot != null ? (
            <div className={styles.right}>{rightSlot}</div>
          ) : null}
        </div>
      </GlassPanel>
    </header>
  );
}
