// SPDX-License-Identifier: MIT
// @novasphere/ui-bento — BentoCard tests

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import BentoCard from "./BentoCard";
import type { BentoCardConfig } from "../bento.types";

const baseConfig: BentoCardConfig = {
  id: "test-1",
  colSpan: 4,
  rowSpan: 1,
  moduleId: "demo",
  visible: true,
  order: 0,
};

describe("BentoCard", () => {
  it("renders children", () => {
    render(<BentoCard config={baseConfig}>Card content</BentoCard>);
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("renders with title in config without rendering title itself", () => {
    render(
      <BentoCard config={{ ...baseConfig, title: "My Card" }}>
        Inner content
      </BentoCard>
    );
    expect(screen.getByText("Inner content")).toBeInTheDocument();
  });

  it("applies dragging class when isDragging is true", () => {
    const { container } = render(
      <BentoCard config={baseConfig} isDragging>
        Content
      </BentoCard>
    );
    const card = container.querySelector("[class*='dragging']");
    expect(card).toBeInTheDocument();
  });

  it("does not apply dragging class when isDragging is false", () => {
    const { container } = render(
      <BentoCard config={baseConfig} isDragging={false}>
        Content
      </BentoCard>
    );
    const withDragging = container.querySelector("[class*='dragging']");
    expect(withDragging).toBeNull();
  });
});
