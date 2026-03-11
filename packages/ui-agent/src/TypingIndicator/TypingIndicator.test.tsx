// SPDX-License-Identifier: MIT
// @novasphere/ui-agent — TypingIndicator tests

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TypingIndicator from "./TypingIndicator";

describe("TypingIndicator", () => {
  it("renders without crashing", () => {
    render(<TypingIndicator />);
    expect(screen.getByRole("status", { name: "Agent is typing" })).toBeInTheDocument();
  });

  it("renders three dots", () => {
    const { container } = render(<TypingIndicator />);
    const dots = container.querySelectorAll("[aria-hidden]");
    expect(dots).toHaveLength(3);
  });

  it("uses custom aria-label when provided", () => {
    render(<TypingIndicator aria-label="Thinking…" />);
    expect(screen.getByRole("status", { name: "Thinking…" })).toBeInTheDocument();
  });
});
