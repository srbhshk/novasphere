// SPDX-License-Identifier: MIT
// @novasphere/ui-charts — SparklineChart tests

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SparklineChart from "./SparklineChart";
import { sparklineData } from "../mocks/chart-data.mock";

describe("SparklineChart", () => {
  it("renders without crashing", () => {
    render(<SparklineChart data={sparklineData} />);
    expect(document.querySelector(".recharts-responsive-container")).toBeTruthy();
  });

  it("shows loading skeleton when loading is true", () => {
    render(<SparklineChart data={sparklineData} loading />);
    expect(screen.getByRole("status", { name: /loading chart/i })).toBeInTheDocument();
  });

  it("shows empty state when empty is true", () => {
    render(<SparklineChart data={sparklineData} empty />);
    expect(screen.getByRole("status", { name: /no data/i })).toBeInTheDocument();
  });

  it("shows empty state when data is empty", () => {
    render(<SparklineChart data={[]} />);
    expect(screen.getByRole("status", { name: /no data/i })).toBeInTheDocument();
  });

  it("renders chart when data is provided", () => {
    render(<SparklineChart data={sparklineData} />);
    expect(document.querySelector(".recharts-responsive-container")).toBeTruthy();
    expect(screen.queryByRole("status", { name: /no data/i })).not.toBeInTheDocument();
  });
});
