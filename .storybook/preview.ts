// SPDX-License-Identifier: MIT
// novasphere — shared Storybook preview (imports tokens)

import type { Preview } from "@storybook/react";
import "./storybook.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#0a0a0a" },
        { name: "light", value: "#fafafa" },
      ],
    },
  },
};

export default preview;
