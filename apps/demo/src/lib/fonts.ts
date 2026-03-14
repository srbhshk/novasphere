/**
 * Font registry for the novasphere demo app.
 * Uses next/font for optimized, self-hosted Google Fonts.
 * Configurable via nova.config.ts theme.fontFamily.
 * Falls back to Corben when configured font is not in the registry.
 */

import { Corben, Inter } from "next/font/google";

const corben = Corben({
  weight: ["400"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
  variable: "--ns-font-sans",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
  variable: "--ns-font-sans",
});

/** Supported font families. Add entries here to make new fonts configurable. */
export const fontRegistry = {
  Corben: corben,
  Inter: inter,
} as const;

export type FontFamilyKey = keyof typeof fontRegistry;

/** Default font when config is missing or font not in registry. */
const DEFAULT_FONT: FontFamilyKey = "Corben";

/**
 * Returns the configured font for the application.
 * Uses theme.fontFamily from nova.config. Falls back to Corben if not found.
 *
 * @param fontFamily - Font name from config (e.g. 'Corben', 'Inter')
 * @returns { className, variable } - Apply to html or body element
 */
export function getAppFont(
  fontFamily?: string | null
): (typeof fontRegistry)[FontFamilyKey] {
  const key = fontFamily as FontFamilyKey | undefined;
  if (key && key in fontRegistry) {
    return fontRegistry[key];
  }
  return fontRegistry[DEFAULT_FONT];
}
