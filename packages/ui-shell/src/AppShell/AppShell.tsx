// SPDX-License-Identifier: MIT
// @novasphere/ui-shell — AppShell
// Dashboard shell: grid layout (sidebar + main), ambient background, grain, tenant accent override.

"use client";

import * as React from "react";
import type { TenantConfig } from "@novasphere/tenant-core";
import { AmbientBackground, GrainOverlay } from "@novasphere/ui-glass";
import { Sidebar } from "../Sidebar";
import { Topbar } from "../Topbar";
import styles from "./AppShell.module.css";

export type AppShellProps = {
  tenant: TenantConfig;
  children: React.ReactNode;
  currentPath: string;
  /** Page title shown in topbar breadcrumb. */
  title?: string;
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
  sidebarUserSlot,
  topbarRightSlot,
}: AppShellProps): JSX.Element {
  const rootStyle = React.useMemo(
    () =>
      tenant.accentColor != null
               ? ({ "--ns-color-accent": tenant.accentColor } as React.CSSProperties)
        : undefined,
    [tenant.accentColor]
  );

  return (
    <div className={styles.root} style={rootStyle}>
      <div className={styles.ambientLayer} aria-hidden>
        <AmbientBackground />
      </div>
      <div className={styles.grainLayer} aria-hidden>
        <GrainOverlay />
      </div>
      <div className={styles.sidebarArea}>
        <Sidebar
          tenant={tenant}
          currentPath={currentPath}
          userSlot={sidebarUserSlot}
        />
      </div>
      <div className={styles.topbarArea}>
        <Topbar
          tenant={tenant}
          title={title}
          rightSlot={topbarRightSlot}
        />
      </div>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
