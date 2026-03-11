// SPDX-License-Identifier: MIT
// apps/demo — tenant registry with demo-specific overrides.

import { TENANT_REGISTRY } from "@novasphere/tenant-core";
import type { TenantConfig } from "@novasphere/tenant-core";

const baseDemo = TENANT_REGISTRY["demo"];
if (!baseDemo) {
  throw new Error("TENANT_REGISTRY.demo is required");
}

/** Demo app tenant registry. Re-exports TENANT_REGISTRY with optional overrides. */
export const DEMO_TENANT_REGISTRY: Record<string, TenantConfig> = {
  ...TENANT_REGISTRY,
  demo: {
    id: baseDemo.id,
    name: "NovaSphere Demo",
    ...(baseDemo.logoUrl !== undefined && baseDemo.logoUrl !== "" && { logoUrl: baseDemo.logoUrl }),
    accentColor: "#4f8ef7",
    features: {
      bentoReorder: true,
      generativeLayout: true,
      multiTenant: false,
      authEnabled: false,
    },
    navItems: baseDemo.navItems,
  },
};

export { TENANT_REGISTRY } from "@novasphere/tenant-core";
