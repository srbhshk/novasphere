/** @type {import('tailwindcss').Config} */
const { novaspherePreset } = require("@novasphere/tokens");

module.exports = {
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
