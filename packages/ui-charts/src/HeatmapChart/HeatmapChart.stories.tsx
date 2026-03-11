// SPDX-License-Identifier: MIT
// @novasphere/ui-charts — HeatmapChart stories

import type { Meta, StoryObj } from "@storybook/react";
import { HeatmapChart } from "./index";
import { heatmapData } from "../mocks/chart-data.mock";

const meta: Meta<typeof HeatmapChart> = {
  component: HeatmapChart,
  title: "ui-charts/HeatmapChart",
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#0c1120" }],
    },
  },
};

export default meta;

type Story = StoryObj<typeof HeatmapChart>;

export const WithData: Story = {
  args: {
    data: heatmapData,
    weeks: 12,
  },
};

export const Loading: Story = {
  args: {
    data: heatmapData,
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    data: [],
    empty: true,
  },
};
