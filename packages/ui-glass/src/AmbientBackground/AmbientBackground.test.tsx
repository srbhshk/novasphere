// SPDX-License-Identifier: MIT
// @novasphere/ui-glass — AmbientBackground tests

import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AmbientBackground from "./AmbientBackground";

describe("AmbientBackground", () => {
  it("renders without crashing", () => {
    const { container } = render(<AmbientBackground />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders three orbs", () => {
    const { container } = render(<AmbientBackground />);
    const orbs = container.querySelectorAll("[class*='orb']");
    expect(orbs.length).toBeGreaterThanOrEqual(3);
  });

  it("is marked aria-hidden", () => {
    const { container } = render(<AmbientBackground />);
    const el = container.querySelector("[aria-hidden='true']");
    expect(el).toBeInTheDocument();
  });
});
