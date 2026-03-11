// SPDX-License-Identifier: MIT
// @novasphere/ui-glass — GlassPanel tests

import { render, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import GlassPanel from "./GlassPanel";

describe("GlassPanel", () => {
  it("renders children", () => {
    const { container } = render(<GlassPanel>Panel content</GlassPanel>);
    expect(within(container).getByText("Panel content")).toBeInTheDocument();
  });

  it("applies correct variant class for medium (default)", () => {
    const { container } = render(<GlassPanel>Content</GlassPanel>);
    const panel = container.firstChild as HTMLElement;
    expect(panel).toHaveClass("medium");
  });

  it("applies correct variant class for subtle", () => {
    const { container } = render(
      <GlassPanel variant="subtle">Content</GlassPanel>
    );
    const panel = container.firstChild as HTMLElement;
    expect(panel).toHaveClass("subtle");
  });

  it("applies correct variant class for strong", () => {
    const { container } = render(
      <GlassPanel variant="strong">Content</GlassPanel>
    );
    const panel = container.firstChild as HTMLElement;
    expect(panel).toHaveClass("strong");
  });

  it("renders header when provided", () => {
    const { container } = render(
      <GlassPanel header={<span>Header text</span>}>Panel body</GlassPanel>
    );
    expect(within(container).getByText("Header text")).toBeInTheDocument();
    expect(within(container).getByText("Panel body")).toBeInTheDocument();
  });

  it("renders footer when provided", () => {
    const { container } = render(
      <GlassPanel footer={<span>Footer text</span>}>Panel body</GlassPanel>
    );
    expect(within(container).getByText("Footer text")).toBeInTheDocument();
    expect(within(container).getByText("Panel body")).toBeInTheDocument();
  });

  it("does not render header or footer when not provided", () => {
    const { container } = render(<GlassPanel>Body only</GlassPanel>);
    expect(container.querySelector("[class*='glassPanelHeader']")).toBeNull();
    expect(container.querySelector("[class*='glassPanelFooter']")).toBeNull();
  });

  it("is accessible via role", () => {
    const { container } = render(<GlassPanel>Content</GlassPanel>);
    expect(
      within(container).getByRole("region", { name: "Panel" })
    ).toBeInTheDocument();
  });

  it("merges custom className", () => {
    const { container } = render(
      <GlassPanel className="custom-class">Content</GlassPanel>
    );
    const panel = container.firstChild as HTMLElement;
    expect(panel).toHaveClass("custom-class");
  });
});
