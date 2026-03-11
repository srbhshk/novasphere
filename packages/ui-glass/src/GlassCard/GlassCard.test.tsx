// SPDX-License-Identifier: MIT
// @novasphere/ui-glass — GlassCard tests

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import GlassCard from "./GlassCard";

describe("GlassCard", () => {
  it("renders children", () => {
    render(<GlassCard>Card content</GlassCard>);
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("applies correct variant class for medium (default)", () => {
    const { container } = render(<GlassCard>Content</GlassCard>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("medium");
  });

  it("applies correct variant class for subtle", () => {
    const { container } = render(
      <GlassCard variant="subtle">Content</GlassCard>
    );
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("subtle");
  });

  it("applies correct variant class for strong", () => {
    const { container } = render(
      <GlassCard variant="strong">Content</GlassCard>
    );
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("strong");
  });

  it("applies highlight class when highlight is true", () => {
    const { container } = render(
      <GlassCard highlight>Content</GlassCard>
    );
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("highlight");
  });

  it("applies hoverable class when not asChild", () => {
    const { container } = render(<GlassCard>Content</GlassCard>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("hoverable");
  });

  it("does not apply hoverable when asChild", () => {
    render(
      <GlassCard asChild>
        <button type="button">Button card</button>
      </GlassCard>
    );
    const btn = screen.getByRole("button", { name: "Button card" });
    expect(btn).not.toHaveClass("hoverable");
  });

  it("is accessible via role when not asChild", () => {
    render(<GlassCard>Content</GlassCard>);
    expect(screen.getByRole("group")).toBeInTheDocument();
  });

  it("merges custom className", () => {
    const { container } = render(
      <GlassCard className="custom-class">Content</GlassCard>
    );
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("custom-class");
  });
});
