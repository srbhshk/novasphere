import type { Config } from "tailwindcss";
import { novaspherePreset } from "@novasphere/tokens";

const config: Config = {
  presets: [novaspherePreset],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui-glass/src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui-bento/src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui-charts/src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui-agent/src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui-auth/src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui-shell/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
