// SPDX-License-Identifier: MIT
// novasphere — E2E: Copilot panel and Generative UI (restructure dashboard).
// Requires MockAdapter: run with NEXT_PUBLIC_AI_ADAPTER=mock (playwright webServer sets this when it starts the app).

import { test, expect } from "@playwright/test";

test.describe("Copilot and Generative UI", () => {
  test("restructure dashboard: opens copilot, sends message, grid or order changes, toast visible", async ({
    page,
  }) => {
    await page.goto("/demo");
    await expect(page.getByRole("main")).toBeVisible({ timeout: 15_000 });

    const initialCards = page.locator("[data-bento-card-id]");
    const initialCount = await initialCards.count();
    expect(initialCount).toBeGreaterThanOrEqual(1);

    const openCopilot = page.getByRole("button", { name: /open copilot/i });
    await openCopilot.click();
    await expect(page.getByPlaceholder(/ask nova/i)).toBeVisible({ timeout: 5_000 });

    const input = page.getByPlaceholder(/ask nova/i);
    await input.fill("restructure dashboard");
    await page.getByRole("button", { name: /send message/i }).click();

    await expect(page.getByTestId("layout-restructure-toast")).toBeVisible({
      timeout: 20_000,
    });
    await expect(page.getByTestId("layout-restructure-toast")).toContainText(
      "Nova restructured your dashboard"
    );

    const cardsAfter = page.locator("[data-bento-card-id]");
    const countAfter = await cardsAfter.count();
    expect(countAfter).toBeGreaterThanOrEqual(1);
    expect(countAfter).not.toBe(initialCount);
  });
});
