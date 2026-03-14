// SPDX-License-Identifier: MIT
// @novasphere/ui-shell — AppShell tests

import { render, screen, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import type { TenantConfig } from "@novasphere/tenant-core";
import { TENANT_REGISTRY } from "@novasphere/tenant-core";
import AppShell from "./AppShell";

const tenant: TenantConfig = TENANT_REGISTRY.demo as TenantConfig;

describe("AppShell", () => {
  it("renders children in main area", () => {
    render(
      <AppShell tenant={tenant} currentPath="/demo/dashboard">
        <p>Dashboard content</p>
      </AppShell>
    );
    expect(screen.getByText("Dashboard content")).toBeInTheDocument();
  });

  it("applies tenant accent when provided", () => {
    const tenantWithAccent: TenantConfig = { ...tenant, accentColor: "#ff0000" }; /* intentional: test assertion */
    const { container } = render(
      <AppShell tenant={tenantWithAccent} currentPath="/demo/dashboard">
        <span>Content</span>
      </AppShell>
    );
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveStyle({ "--ns-color-accent": "#ff0000" }); /* intentional: test assertion */
  });

  it("renders sidebar and topbar", () => {
    render(
      <AppShell tenant={tenant} currentPath="/demo/dashboard">
        <span>Content</span>
      </AppShell>
    );
    expect(screen.getByRole("navigation", { name: "Main navigation" })).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("passes breadcrumbs to topbar when provided", () => {
    render(
      <AppShell
        tenant={tenant}
        currentPath="/demo/settings"
        breadcrumbs={[
          { label: "Settings", href: "/demo/settings" },
          { label: "API Keys" },
        ]}
      >
        <span>Settings content</span>
      </AppShell>
    );
    const banner = screen.getByRole("banner");
    const settingsLink = within(banner).getByRole("link", { name: "Settings" });
    expect(settingsLink).toHaveAttribute("href", "/demo/settings");
    expect(within(banner).getByText("API Keys")).toHaveAttribute("aria-current", "page");
  });
});
