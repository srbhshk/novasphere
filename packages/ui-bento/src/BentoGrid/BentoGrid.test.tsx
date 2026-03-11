// SPDX-License-Identifier: MIT
// @novasphere/ui-bento — BentoGrid tests

import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import BentoGrid from "./BentoGrid";
import type { BentoLayoutConfig, BentoCardModuleProps } from "../bento.types";

function DummyModule({ config }: BentoCardModuleProps): JSX.Element {
  return <span data-testid={`module-${config.id}`}>{config.id}</span>;
}

const modules = { dummy: DummyModule };

describe("BentoGrid", () => {
  it("renders correct number of visible cards", () => {
    const layout: BentoLayoutConfig = [
      { id: "a", colSpan: 4, rowSpan: 1, moduleId: "dummy", visible: true, order: 0 },
      { id: "b", colSpan: 4, rowSpan: 1, moduleId: "dummy", visible: true, order: 1 },
      { id: "c", colSpan: 4, rowSpan: 1, moduleId: "dummy", visible: true, order: 2 },
    ];
    render(<BentoGrid layout={layout} modules={modules} />);
    expect(screen.getByTestId("module-a")).toBeInTheDocument();
    expect(screen.getByTestId("module-b")).toBeInTheDocument();
    expect(screen.getByTestId("module-c")).toBeInTheDocument();
  });

  it("does not render hidden cards", () => {
    const layout: BentoLayoutConfig = [
      { id: "visible", colSpan: 4, rowSpan: 1, moduleId: "dummy", visible: true, order: 0 },
      { id: "hidden", colSpan: 4, rowSpan: 1, moduleId: "dummy", visible: false, order: 1 },
    ];
    render(<BentoGrid layout={layout} modules={modules} />);
    expect(screen.getByTestId("module-visible")).toBeInTheDocument();
    expect(screen.queryByTestId("module-hidden")).not.toBeInTheDocument();
  });

  it("renders cards in order by order prop", () => {
    const layout: BentoLayoutConfig = [
      { id: "third", colSpan: 4, rowSpan: 1, moduleId: "dummy", visible: true, order: 2 },
      { id: "first", colSpan: 4, rowSpan: 1, moduleId: "dummy", visible: true, order: 0 },
      { id: "second", colSpan: 4, rowSpan: 1, moduleId: "dummy", visible: true, order: 1 },
    ];
    const { container } = render(<BentoGrid layout={layout} modules={modules} />);
    const grid = container.firstChild as HTMLElement;
    const moduleEls = [
      screen.getByTestId("module-first"),
      screen.getByTestId("module-second"),
      screen.getByTestId("module-third"),
    ];
    moduleEls.forEach((el) => expect(grid).toContainElement(el));
    const firstIndex = grid.innerHTML.indexOf('data-testid="module-first"');
    const secondIndex = grid.innerHTML.indexOf('data-testid="module-second"');
    const thirdIndex = grid.innerHTML.indexOf('data-testid="module-third"');
    expect(firstIndex).toBeLessThan(secondIndex);
    expect(secondIndex).toBeLessThan(thirdIndex);
  });

  it("renders with onReorder provided so drag-to-reorder is enabled", () => {
    const layout: BentoLayoutConfig = [
      { id: "a", colSpan: 4, rowSpan: 1, moduleId: "dummy", visible: true, order: 0 },
      { id: "b", colSpan: 4, rowSpan: 1, moduleId: "dummy", visible: true, order: 1 },
    ];
    const onReorder = vi.fn();
    render(<BentoGrid layout={layout} modules={modules} onReorder={onReorder} />);
    expect(screen.getByTestId("module-a")).toBeInTheDocument();
    expect(screen.getByTestId("module-b")).toBeInTheDocument();
    // onReorder is wired; actual drag behaviour is covered by E2E (Playwright).
  });

  it("renders unknown moduleId as fallback text", () => {
    const layout: BentoLayoutConfig = [
      { id: "x", colSpan: 4, rowSpan: 1, moduleId: "nonexistent", visible: true, order: 0 },
    ];
    render(<BentoGrid layout={layout} modules={modules} />);
    expect(screen.getByText("nonexistent")).toBeInTheDocument();
  });
});
