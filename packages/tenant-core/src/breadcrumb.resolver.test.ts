// SPDX-License-Identifier: MIT
// @novasphere/tenant-core — getBreadcrumbs tests

import { describe, it, expect } from "vitest";
import { getBreadcrumbs } from "./breadcrumb.resolver";
import type { TenantConfig } from "./tenant.types";

const tenant: TenantConfig = {
  id: "demo",
  name: "Demo",
  features: {
    bentoReorder: true,
    generativeLayout: true,
    multiTenant: false,
    authEnabled: false,
  },
  navItems: [
    { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard", href: "/demo/dashboard" },
    { id: "analytics", label: "Analytics", icon: "BarChart3", href: "/demo/analytics" },
    {
      id: "settings",
      label: "Settings",
      icon: "Settings",
      href: "/demo/settings",
      children: [
        { id: "api", label: "API Keys", href: "/demo/settings/api" },
        { id: "general", label: "General", href: "/demo/settings/general" },
      ],
    },
  ],
};

describe("getBreadcrumbs", () => {
  it("returns single segment for exact nav match", () => {
    const result = getBreadcrumbs("/demo/dashboard", tenant);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ label: "Dashboard" });
  });

  it("returns single segment for exact nav match (analytics)", () => {
    const result = getBreadcrumbs("/demo/analytics", tenant);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ label: "Analytics" });
  });

  it("returns two segments when path matches a child", () => {
    const result = getBreadcrumbs("/demo/settings/api", tenant);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ label: "Settings", href: "/demo/settings" });
    expect(result[1]).toEqual({ label: "API Keys" });
  });

  it("returns two segments for other child (general)", () => {
    const result = getBreadcrumbs("/demo/settings/general", tenant);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ label: "Settings", href: "/demo/settings" });
    expect(result[1]).toEqual({ label: "General" });
  });

  it("returns single segment for nav with path under it but no child match", () => {
    const result = getBreadcrumbs("/demo/settings/other", tenant);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ label: "Settings" });
  });

  it("normalizes trailing slash for exact match", () => {
    const result = getBreadcrumbs("/demo/dashboard/", tenant);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ label: "Dashboard" });
  });

  it("returns fallback when path does not match any nav", () => {
    const result = getBreadcrumbs("/demo/unknown", tenant);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ label: "Page" });
  });

  it("uses custom fallback title when path does not match", () => {
    const result = getBreadcrumbs("/demo/unknown", tenant, "Page not found");
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ label: "Page not found" });
  });

  it("returns at most 2 segments", () => {
    const result = getBreadcrumbs("/demo/settings/api", tenant);
    expect(result.length).toBeLessThanOrEqual(2);
  });
});
