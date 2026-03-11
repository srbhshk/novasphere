// SPDX-License-Identifier: MIT
// @novasphere/ui-shell — NavItem tests

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import NavItem from "./NavItem";

const mockItem = {
  id: "dashboard",
  label: "Dashboard",
  icon: "LayoutDashboard",
  href: "/demo/dashboard",
};

describe("NavItem", () => {
  it("renders label and link", () => {
    render(<NavItem item={mockItem} />);
    const link = screen.getByRole("link", { name: "Dashboard" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/demo/dashboard");
  });

  it("shows title when collapsed for tooltip", () => {
    render(<NavItem item={mockItem} isCollapsed />);
    const link = screen.getByRole("link", { name: "Dashboard" });
    expect(link).toHaveAttribute("title", "Dashboard");
  });

  it("sets aria-current when active", () => {
    render(<NavItem item={{ ...mockItem, active: true }} />);
    const link = screen.getByRole("link", { name: "Dashboard" });
    expect(link).toHaveAttribute("aria-current", "page");
  });
});
