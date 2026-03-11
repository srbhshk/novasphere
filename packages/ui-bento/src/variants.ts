// SPDX-License-Identifier: MIT
// @novasphere/ui-bento — Framer Motion variants for Bento components

import type { Variants } from "framer-motion";

/** Enter/exit and layout variants for Bento grid items. */
export const bentoItemVariants: Variants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
};
