// SPDX-License-Identifier: MIT
// @novasphere/ui-charts — ChartSkeleton tests

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ChartSkeleton from "./ChartSkeleton";

describe("ChartSkeleton", () => {
  it("renders with aria-label for loading", () => {
    render(<ChartSkeleton height={100} />);
    expect(screen.getByRole("status", { name: /loading chart/i })).toBeInTheDocument();
  });

  it("applies height style", () => {
    const { container } = render(<ChartSkeleton height={64} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({ height: "64px" });
  });
});
