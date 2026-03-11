// SPDX-License-Identifier: MIT
// @novasphere/ui-charts — AreaChart stories

import type { Meta, StoryObj } from "@storybook/react";
import { AreaChart } from "./index";
import { areaData } from "../mocks/chart-data.mock";

const meta: Meta<typeof AreaChart> = {
  component: AreaChart,
  title: "ui-charts/AreaChart",
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#0c1120" }],
    },
  },
};

export default meta;

type Story = StoryObj<typeof AreaChart>;

export const WithData: Story = {
  args: {
    data: areaData,
    label: "Weekly activity",
  },
};

export const Loading: Story = {
  args: {
    data: areaData,
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    data: [],
    empty: true,
  },
};
