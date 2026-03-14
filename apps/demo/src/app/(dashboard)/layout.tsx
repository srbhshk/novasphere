// SPDX-License-Identifier: MIT
// apps/demo — Dashboard layout (RSC). Reads tenant from headers, wraps in AppShell + TanStack Query.

import type React from "react";
import { headers } from "next/headers";
import { resolveTenant } from "@novasphere/tenant-core";
import DashboardProviders from "./DashboardProviders";

const DEFAULT_TENANT_ID = "demo";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): Promise<React.ReactElement> {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id") ?? DEFAULT_TENANT_ID;
  let tenant;
  try {
    tenant = resolveTenant(tenantId);
  } catch {
    tenant = resolveTenant(DEFAULT_TENANT_ID);
  }
  return (
    <DashboardProviders tenant={tenant} title="Dashboard">
      {children}
    </DashboardProviders>
  );
}
