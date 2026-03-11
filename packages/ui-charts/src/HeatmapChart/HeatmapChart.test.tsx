// SPDX-License-Identifier: MIT
// @novasphere/ui-charts — HeatmapChart tests

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import HeatmapChart from "./HeatmapChart";
import { heatmapData } from "../mocks/chart-data.mock";

describe("HeatmapChart", () => {
  it("renders without crashing", () => {
    render(<HeatmapChart data={heatmapData} />);
    expect(screen.getByRole("img", { name: /heatmap grid/i })).toBeInTheDocument();
  });

  it("shows loading skeleton when loading is true", () => {
    render(<HeatmapChart data={heatmapData} loading />);
    expect(screen.getByRole("status", { name: /loading chart/i })).toBeInTheDocument();
  });

  it("shows empty state when empty is true", () => {
    render(<HeatmapChart data={heatmapData} empty />);
    expect(screen.getByRole("status", { name: /no data/i })).toBeInTheDocument();
  });

  it("shows empty state when data is empty", () => {
    render(<HeatmapChart data={[]} />);
    expect(screen.getByRole("status", { name: /no data/i })).toBeInTheDocument();
  });

  it("renders grid cells", () => {
    render(<HeatmapChart data={heatmapData} weeks={12} />);
    const buttons = document.querySelectorAll("button[type='button']");
    expect(buttons.length).toBe(7 * 12);
  });
});
