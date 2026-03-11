// SPDX-License-Identifier: MIT
// @novasphere/ui-shell — BreadcrumbBar tests

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import BreadcrumbBar from "./BreadcrumbBar";

describe("BreadcrumbBar", () => {
  it("renders single item as current", () => {
    render(<BreadcrumbBar items={[{ label: "Dashboard" }]} />);
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toHaveAttribute("aria-current", "page");
  });

  it("renders links for non-last items", () => {
    render(
      <BreadcrumbBar
        items={[
          { label: "Home", href: "/" },
          { label: "Dashboard" },
        ]}
      />
    );
    const link = screen.getByRole("link", { name: "Home" });
    expect(link).toHaveAttribute("href", "/");
    expect(screen.getByText("Dashboard")).toHaveAttribute("aria-current", "page");
  });

  it("renders empty nav when no items", () => {
    render(<BreadcrumbBar items={[]} />);
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(nav).toBeInTheDocument();
    expect(nav).toBeEmptyDOMElement();
  });
});
