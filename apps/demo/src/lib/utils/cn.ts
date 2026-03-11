// SPDX-License-Identifier: MIT
// apps/demo — cn
// Combines clsx and tailwind-merge for conditional Tailwind class names.

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names with clsx and tailwind-merge. Use for conditional Tailwind classes.
 *
 * @param inputs - Class values (strings, objects, arrays)
 * @returns Single deduplicated class string
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(...inputs));
}
