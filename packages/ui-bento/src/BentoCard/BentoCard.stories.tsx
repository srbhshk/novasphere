// SPDX-License-Identifier: MIT
// @novasphere/ui-bento — BentoCard stories

import type { Meta, StoryObj } from "@storybook/react";
import BentoCard from "./BentoCard";
import type { BentoCardConfig } from "../bento.types";

const sampleConfig: BentoCardConfig = {
  id: "card-1",
  colSpan: 4,
  rowSpan: 1,
  moduleId: "demo",
  title: "Demo Card",
  visible: true,
  order: 0,
};

const meta: Meta<typeof BentoCard> = {
  component: BentoCard,
  title: "ui-bento/BentoCard",
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark", values: [{ name: "dark", value: "#0c1120" }] },
  },
};

export default meta;

type Story = StoryObj<typeof BentoCard>;

export const Default: Story = {
  args: {
    config: sampleConfig,
    children: "Card content",
  },
};

export const WithTitle: Story = {
  args: {
    config: { ...sampleConfig, title: "Metrics Overview" },
    children: <p className="text-sm text-white/80">Chart or metrics go here.</p>,
  },
};

export const IsDragging: Story = {
  args: {
    config: sampleConfig,
    isDragging: true,
    children: "Dragging state — elevated shadow, scale",
  },
};

export const LargeSpan: Story = {
  args: {
    config: {
      ...sampleConfig,
      colSpan: 8,
      rowSpan: 2,
      title: "Wide & Tall",
    },
    children: (
      <div className="p-4 text-white/90">
        <h3 className="font-medium">Wide card</h3>
        <p className="text-sm text-white/70 mt-2">Row span 2, col span 8.</p>
      </div>
    ),
  },
};
