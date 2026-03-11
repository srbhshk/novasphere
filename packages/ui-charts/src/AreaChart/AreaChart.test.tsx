// SPDX-License-Identifier: MIT
// @novasphere/ui-charts — AreaChart tests

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AreaChart from "./AreaChart";
import { areaData } from "../mocks/chart-data.mock";

describe("AreaChart", () => {
  it("renders without crashing", () => {
    render(<AreaChart data={areaData} />);
    expect(document.querySelector(".recharts-responsive-container")).toBeTruthy();
  });

  it("shows loading skeleton when loading is true", () => {
    render(<AreaChart data={areaData} loading />);
    expect(screen.getByRole("status", { name: /loading chart/i })).toBeInTheDocument();
  });

  it("shows empty state when empty is true", () => {
    render(<AreaChart data={areaData} empty />);
    expect(screen.getByRole("status", { name: /no data/i })).toBeInTheDocument();
  });

  it("shows empty state when data is empty", () => {
    render(<AreaChart data={[]} />);
    expect(screen.getByRole("status", { name: /no data/i })).toBeInTheDocument();
  });

  it("renders label when provided", () => {
    render(<AreaChart data={areaData} label="Weekly activity" />);
    expect(screen.getByText("Weekly activity")).toBeInTheDocument();
  });
});
