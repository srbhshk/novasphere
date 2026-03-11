// SPDX-License-Identifier: MIT
// @novasphere/ui-charts — ChartEmpty tests

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ChartEmpty from "./ChartEmpty";

describe("ChartEmpty", () => {
  it("renders default message", () => {
    render(<ChartEmpty />);
    expect(screen.getByRole("status", { name: /no data/i })).toBeInTheDocument();
    expect(screen.getByText("No data")).toBeInTheDocument();
  });

  it("renders custom message", () => {
    render(<ChartEmpty message="No metrics" />);
    expect(screen.getByRole("status", { name: /no metrics/i })).toBeInTheDocument();
    expect(screen.getByText("No metrics")).toBeInTheDocument();
  });
});
