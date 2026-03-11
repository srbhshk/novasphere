// SPDX-License-Identifier: MIT
// @novasphere/ui-charts — SparklineChart stories

import type { Meta, StoryObj } from "@storybook/react";
import { SparklineChart } from "./index";
import { sparklineData } from "../mocks/chart-data.mock";

const meta: Meta<typeof SparklineChart> = {
  component: SparklineChart,
  title: "ui-charts/SparklineChart",
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#0c1120" }],
    },
  },
};

export default meta;

type Story = StoryObj<typeof SparklineChart>;

export const Default: Story = {
  args: {
    data: sparklineData,
    height: 80,
  },
};

export const WithData: Story = {
  args: {
    data: sparklineData,
    height: 80,
  },
};

export const Loading: Story = {
  args: {
    data: sparklineData,
    loading: true,
    height: 80,
  },
};

export const Empty: Story = {
  args: {
    data: [],
    empty: true,
  },
};
