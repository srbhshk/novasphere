// SPDX-License-Identifier: MIT
// @novasphere/ui-shell — AppShell
// Dashboard shell: sticky header, sticky left sidebar (minimized by default, expand on click), main area with padding and vertical scroll.

"use client";

import * as React from "react";
import type { TenantConfig } from "@novasphere/tenant-core";
import { AmbientBackground, GrainOverlay } from "@novasphere/ui-glass";
import { Sidebar } from "../Sidebar";
import { Topbar } from "../Topbar";
import type { BreadcrumbItem } from "../BreadcrumbBar";
import styles from "./AppShell.module.css";

export type AppShellProps = {
  tenant: TenantConfig;
  children: React.ReactNode;
  currentPath: string;
  /** Page title; used as fallback when breadcrumbs are not provided or path has no match. */
  title?: string;
  /** Optional breadcrumb items (e.g. from getBreadcrumbs). When provided, overrides title in topbar. */
  breadcrumbs?: BreadcrumbItem[];
  /** Optional slot for user avatar/menu in sidebar (e.g. UserMenu from ui-auth). */
  sidebarUserSlot?: React.ReactNode;
  /** Optional slot for right-side topbar actions (buttons + avatar). */
  topbarRightSlot?: React.ReactNode;
};

export default function AppShell({
  tenant,
  children,
  currentPath,
  title = "Dashboard",
  breadcrumbs,
  sidebarUserSlot,
  topbarRightSlot,
}: AppShellProps): React.ReactElement {
  const [sidebarExpanded, setSidebarExpanded] = React.useState(false);
  const rootStyle = React.useMemo(
    () =>
      tenant.accentColor != null
        ? ({ "--ns-color-accent": tenant.accentColor } as React.CSSProperties)
        : undefined,
    [tenant.accentColor]
  );

  const handleSidebarExpandToggle = React.useCallback(() => {
    setSidebarExpanded((prev) => !prev);
  }, []);

  return (
    <div className={styles.root} style={rootStyle}>
      <div className={styles.ambientLayer} aria-hidden>
        <AmbientBackground />
      </div>
      <div className={styles.grainLayer} aria-hidden>
        <GrainOverlay />
      </div>
      <div className={styles.topbarArea}>
        <Topbar
          tenant={tenant}
          title={title}
          {...(breadcrumbs != null && breadcrumbs.length > 0
            ? { breadcrumbs }
            : {})}
          rightSlot={topbarRightSlot}
        />
      </div>
      <div className={styles.contentRow}>
        <div className={styles.sidebarArea}>
          <Sidebar
            tenant={tenant}
            currentPath={currentPath}
            userSlot={sidebarUserSlot}
            expanded={sidebarExpanded}
            onExpandToggle={handleSidebarExpandToggle}
          />
        </div>
        <main className={styles.main} id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
