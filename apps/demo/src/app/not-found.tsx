// SPDX-License-Identifier: MIT
// apps/demo — Global 404. Renders inside the application shell (AppShell + sidebar).

import type React from "react";
import { resolveTenant } from "@novasphere/tenant-core";
import DashboardProviders from "./(dashboard)/DashboardProviders";
import NotFoundContent from "@/components/NotFoundContent";

/**
 * Global 404 page. Uses the same dashboard layout (shell, sidebar, topbar)
 * so the experience stays inside the app with Back and Home actions.
 */
export default function NotFound(): React.ReactElement {
  const tenant = resolveTenant("demo");
  return (
    <DashboardProviders tenant={tenant} title="Page not found">
      <NotFoundContent />
    </DashboardProviders>
  );
}
