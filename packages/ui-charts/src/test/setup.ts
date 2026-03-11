// SPDX-License-Identifier: MIT
// @novasphere/ui-charts — Vitest setup

import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeAll } from "vitest";

beforeAll(() => {
  class ResizeObserverMock {
    observe = () => undefined;
    unobserve = () => undefined;
    disconnect = () => undefined;
  }
  global.ResizeObserver = ResizeObserverMock;
});

afterEach(() => {
  cleanup();
});
