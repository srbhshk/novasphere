// SPDX-License-Identifier: MIT
// @novasphere/ui-glass — GrainOverlay stories

import type { Meta, StoryObj } from "@storybook/react";
import GrainOverlay from "./GrainOverlay";

const meta: Meta<typeof GrainOverlay> = {
  component: GrainOverlay,
  title: "ui-glass/GrainOverlay",
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark", values: [{ name: "dark", value: "#0c1120" }] },
  },
};

export default meta;

type Story = StoryObj<typeof GrainOverlay>;

export const Default: Story = {
  render: () => (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <GrainOverlay />
      <div style={{ padding: 24, color: "#e8ecf4" }}>
        Content behind grain overlay
      </div>
    </div>
  ),
};
