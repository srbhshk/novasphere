// SPDX-License-Identifier: MIT
// @novasphere/ui-shell — Vitest setup

import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});
