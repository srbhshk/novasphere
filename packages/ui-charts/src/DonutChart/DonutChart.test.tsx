// SPDX-License-Identifier: MIT
// @novasphere/ui-charts — DonutChart tests

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DonutChart from "./DonutChart";
import { donutSegments } from "../mocks/chart-data.mock";

describe("DonutChart", () => {
  it("renders without crashing", () => {
    render(<DonutChart segments={donutSegments} />);
    expect(document.querySelector(".recharts-responsive-container")).toBeTruthy();
  });

  it("shows loading skeleton when loading is true", () => {
    render(<DonutChart segments={donutSegments} loading />);
    expect(screen.getByRole("status", { name: /loading chart/i })).toBeInTheDocument();
  });

  it("shows empty state when empty is true", () => {
    render(<DonutChart segments={donutSegments} empty />);
    expect(screen.getByRole("status", { name: /no data/i })).toBeInTheDocument();
  });

  it("shows empty state when segments is empty", () => {
    render(<DonutChart segments={[]} />);
    expect(screen.getByRole("status", { name: /no data/i })).toBeInTheDocument();
  });

  it("renders center label when provided", () => {
    render(<DonutChart segments={donutSegments} centerLabel="Total" />);
    expect(screen.getByText("Total")).toBeInTheDocument();
  });

  it("renders legend labels", () => {
    render(<DonutChart segments={donutSegments} />);
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });
});
