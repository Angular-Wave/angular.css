import { expect, test } from "@playwright/test";

test("native range needs no AngularCSS directive", async ({ page }) => {
  await page.goto("/src/elements/range/range.html");

  const range = page.getByLabel("Volume");
  await expect(range).toHaveValue("75");
  await expect(range).not.toHaveAttribute("ng-range-slider");

  await range.fill("42");
  await expect(page.locator('output[for="volume"]')).toHaveText("42");
});
