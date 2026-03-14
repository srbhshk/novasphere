// SPDX-License-Identifier: MIT
// @novasphere/tokens — Tailwind preset
// Import this preset in tailwind.config.ts for design token consistency.

/** Tailwind preset for novasphere design tokens. Use in presets: [novaspherePreset]. */
export const novaspherePreset = {
  theme: {
    extend: {
      colors: {
        ns: {
          bg: "var(--ns-color-bg)",
          surface: "var(--ns-color-surface)",
          accent: "var(--ns-color-accent)",
          "accent-2": "var(--ns-color-accent-2)",
          "accent-3": "var(--ns-color-accent-3)",
          text: "var(--ns-color-text)",
          muted: "var(--ns-color-muted)",
          danger: "var(--ns-color-danger)",
          border: "var(--ns-color-border)",
          "border-hi": "var(--ns-color-border-hi)",
        },
      },
      borderRadius: {
        "ns-sm": "var(--ns-radius-sm)",
        "ns-md": "var(--ns-radius-md)",
        "ns-lg": "var(--ns-radius-lg)",
        "ns-xl": "var(--ns-radius-xl)",
      },
      backdropBlur: {
        "ns-sm": "var(--ns-blur-sm)",
        "ns-md": "var(--ns-blur-md)",
        "ns-lg": "var(--ns-blur-lg)",
      },
      transitionTimingFunction: {
        "ns-spring": "var(--ns-ease-spring)",
        "ns-smooth": "var(--ns-ease-smooth)",
      },
      transitionDuration: {
        "ns-fast": "var(--ns-duration-fast)",
        "ns-base": "var(--ns-duration-base)",
        "ns-slow": "var(--ns-duration-slow)",
      },
      boxShadow: {
        "ns-card": "var(--ns-shadow-card)",
        "ns-card-hover": "var(--ns-shadow-card-hover)",
        "ns-sidebar": "var(--ns-shadow-sidebar)",
        "ns-topbar": "var(--ns-shadow-topbar)",
        "ns-panel": "var(--ns-shadow-panel)",
        "ns-elevated": "var(--ns-shadow-elevated)",
      },
    },
  },
} as const;
