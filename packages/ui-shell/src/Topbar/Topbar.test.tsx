// SPDX-License-Identifier: MIT
// @novasphere/ui-shell — Topbar tests

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import type { TenantConfig } from "@novasphere/tenant-core";
import { TENANT_REGISTRY } from "@novasphere/tenant-core";
import Topbar from "./Topbar";

const tenant: TenantConfig = TENANT_REGISTRY.demo as TenantConfig;

describe("Topbar", () => {
  it("renders title as single breadcrumb when breadcrumbs not provided", () => {
    render(<Topbar tenant={tenant} title="Dashboard" />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toHaveAttribute("aria-current", "page");
  });

  it("renders provided breadcrumbs when non-empty", () => {
    render(
      <Topbar
        tenant={tenant}
        title="Dashboard"
        breadcrumbs={[
          { label: "Settings", href: "/demo/settings" },
          { label: "API Keys" },
        ]}
      />
    );
    expect(screen.getByRole("link", { name: "Settings" })).toHaveAttribute("href", "/demo/settings");
    expect(screen.getByText("API Keys")).toHaveAttribute("aria-current", "page");
  });

  it("falls back to title when breadcrumbs is empty array", () => {
    render(<Topbar tenant={tenant} title="Fallback" breadcrumbs={[]} />);
    expect(screen.getByText("Fallback")).toBeInTheDocument();
  });
});
