// SPDX-License-Identifier: MIT
// @novasphere/ui-charts — DonutChart stories

import type { Meta, StoryObj } from "@storybook/react";
import { DonutChart } from "./index";
import { donutSegments } from "../mocks/chart-data.mock";

const meta: Meta<typeof DonutChart> = {
  component: DonutChart,
  title: "ui-charts/DonutChart",
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#0c1120" }],
    },
  },
};

export default meta;

type Story = StoryObj<typeof DonutChart>;

export const WithData: Story = {
  args: {
    segments: donutSegments,
    centerLabel: "Total",
    size: 200,
  },
};

export const Loading: Story = {
  args: {
    segments: donutSegments,
    loading: true,
    size: 200,
  },
};

export const Empty: Story = {
  args: {
    segments: [],
    empty: true,
  },
};
