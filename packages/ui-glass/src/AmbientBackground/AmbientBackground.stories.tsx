// SPDX-License-Identifier: MIT
// @novasphere/ui-glass — AmbientBackground stories

import type { Meta, StoryObj } from "@storybook/react";
import AmbientBackground from "./AmbientBackground";

const meta: Meta<typeof AmbientBackground> = {
  component: AmbientBackground,
  title: "ui-glass/AmbientBackground",
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark", values: [{ name: "dark", value: "#06080f" }] },
  },
};

export default meta;

type Story = StoryObj<typeof AmbientBackground>;

export const Default: Story = {
  render: () => (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <AmbientBackground />
    </div>
  ),
};
