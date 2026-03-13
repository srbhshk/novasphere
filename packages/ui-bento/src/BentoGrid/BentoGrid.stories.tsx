// SPDX-License-Identifier: MIT
// @novasphere/ui-bento — BentoGrid stories

import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { useState } from "react";
import BentoGrid from "./BentoGrid";
import type { BentoLayoutConfig, BentoCardModuleProps } from "../bento.types";

function PlaceholderModule({ config }: BentoCardModuleProps): React.ReactElement {
  return (
    <div className="p-4 text-white/90">
      <h3 className="font-medium">{config.title ?? config.moduleId}</h3>
      <p className="text-sm text-white/60 mt-1">{config.id}</p>
    </div>
  );
}

const modules = {
  placeholder: PlaceholderModule,
};

const threeCardsLayout: BentoLayoutConfig = [
  { id: "a", colSpan: 4, rowSpan: 1, moduleId: "placeholder", title: "Card A", visible: true, order: 0 },
  { id: "b", colSpan: 4, rowSpan: 1, moduleId: "placeholder", title: "Card B", visible: true, order: 1 },
  { id: "c", colSpan: 4, rowSpan: 1, moduleId: "placeholder", title: "Card C", visible: true, order: 2 },
];

const sixCardsLayout: BentoLayoutConfig = [
  { id: "1", colSpan: 4, rowSpan: 1, moduleId: "placeholder", title: "One", visible: true, order: 0 },
  { id: "2", colSpan: 4, rowSpan: 1, moduleId: "placeholder", title: "Two", visible: true, order: 1 },
  { id: "3", colSpan: 4, rowSpan: 1, moduleId: "placeholder", title: "Three", visible: true, order: 2 },
  { id: "4", colSpan: 4, rowSpan: 1, moduleId: "placeholder", title: "Four", visible: true, order: 3 },
  { id: "5", colSpan: 4, rowSpan: 1, moduleId: "placeholder", title: "Five", visible: true, order: 4 },
  { id: "6", colSpan: 4, rowSpan: 1, moduleId: "placeholder", title: "Six", visible: true, order: 5 },
];

const mixedSpansLayout: BentoLayoutConfig = [
  { id: "wide", colSpan: 8, rowSpan: 2, moduleId: "placeholder", title: "Wide & Tall", visible: true, order: 0 },
  { id: "narrow1", colSpan: 4, rowSpan: 1, moduleId: "placeholder", title: "Narrow 1", visible: true, order: 1 },
  { id: "narrow2", colSpan: 4, rowSpan: 1, moduleId: "placeholder", title: "Narrow 2", visible: true, order: 2 },
];

const meta: Meta<typeof BentoGrid> = {
  component: BentoGrid,
  title: "ui-bento/BentoGrid",
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark", values: [{ name: "dark", value: "#0c1120" }] },
  },
};

export default meta;

type Story = StoryObj<typeof BentoGrid>;

export const ThreeCards: Story = {
  args: {
    layout: threeCardsLayout,
    modules,
  },
  decorators: [
    (Story) => (
      <div className="p-6 w-full max-w-6xl">
        <Story />
      </div>
    ),
  ],
};

export const SixCards: Story = {
  args: {
    layout: sixCardsLayout,
    modules,
  },
  decorators: [
    (Story) => (
      <div className="p-6 w-full max-w-6xl">
        <Story />
      </div>
    ),
  ],
};

export const MixedSpans: Story = {
  args: {
    layout: mixedSpansLayout,
    modules,
  },
  decorators: [
    (Story) => (
      <div className="p-6 w-full max-w-6xl">
        <Story />
      </div>
    ),
  ],
};

function DragToReorderDemo(): React.ReactElement {
  const [layout, setLayout] = useState<BentoLayoutConfig>(threeCardsLayout);
  return (
    <div className="p-6 w-full max-w-6xl">
      <p className="text-white/70 text-sm mb-4">Drag cards to reorder; order updates below.</p>
      <BentoGrid layout={layout} modules={modules} onReorder={setLayout} />
      <pre className="mt-6 text-xs text-white/50 overflow-auto rounded-lg bg-black/20 p-4">
        {JSON.stringify(
          layout.map((c) => ({ id: c.id, order: c.order })),
          null,
          2
        )}
      </pre>
    </div>
  );
}

export const DragToReorder: Story = {
  render: () => <DragToReorderDemo />,
};

export const HiddenCards: Story = {
  args: {
    layout: [
      ...threeCardsLayout,
      { id: "hidden", colSpan: 4, rowSpan: 1, moduleId: "placeholder", title: "Hidden", visible: false, order: 3 },
    ],
    modules,
  },
  decorators: [
    (Story) => (
      <div className="p-6 w-full max-w-6xl">
        <p className="text-white/70 text-sm mb-4">One card has visible: false and is not rendered.</p>
        <Story />
      </div>
    ),
  ],
};
