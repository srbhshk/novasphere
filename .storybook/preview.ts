// SPDX-License-Identifier: MIT
// novasphere — shared Storybook preview (imports tokens)

import type { Preview } from "@storybook/react";
// Resolve tokens CSS from source so Storybook works without building packages
import "../packages/tokens/src/tokens.css";

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
