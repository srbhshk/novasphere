import type { Config } from "tailwindcss";
import { novaspherePreset } from "@novasphere/tokens";

export default {
  presets: [novaspherePreset],
  content: ["./src/**/*.{tsx,ts}"],
} satisfies Config;
