// SPDX-License-Identifier: MIT
// @novasphere/ui-glass — GrainOverlay tests

import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import GrainOverlay from "./GrainOverlay";

describe("GrainOverlay", () => {
  it("renders without crashing", () => {
    const { container } = render(<GrainOverlay />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders an image with noise data URI", () => {
    const { container } = render(<GrainOverlay />);
    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", expect.stringContaining("data:image/svg+xml"));
    expect(img).toHaveAttribute("alt", "");
  });

  it("is marked aria-hidden", () => {
    const { container } = render(<GrainOverlay />);
    const el = container.querySelector("[aria-hidden='true']");
    expect(el).toBeInTheDocument();
  });
});
