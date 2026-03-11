// SPDX-License-Identifier: MIT
// @novasphere/tenant-core — tenant.registry
// Static tenant registry. One demo tenant with all features and 5 nav items.

import type { TenantConfig } from "./tenant.types";

export const TENANT_REGISTRY: Record<string, TenantConfig> = {
  demo: {
    id: "demo",
    name: "NovaSphere Demo",
    features: {
      bentoReorder: true,
      generativeLayout: true,
      multiTenant: true,
      authEnabled: true,
    },
    navItems: [
      { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard", href: "/demo/dashboard" },
      { id: "analytics", label: "Analytics", icon: "BarChart3", href: "/demo/analytics" },
      { id: "pipelines", label: "Pipelines", icon: "GitBranch", href: "/demo/pipelines" },
      { id: "agents", label: "Agents", icon: "Bot", href: "/demo/agents" },
      { id: "settings", label: "Settings", icon: "Settings", href: "/demo/settings" },
    ],
  },
};
