import { expect, test } from "@playwright/test";

test("element dialog page uses the packaged canonical implementation", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/elements/dialog.html");
  await expect(
    page.locator('script[src$="/js/angular-ts.umd.js"]'),
  ).toHaveCount(1);
  await expect(
    page.locator('script[src$="/js/angular-css.umd.js"]'),
  ).toHaveCount(1);
  const sourceRequests = await page.evaluate(() =>
    performance
      .getEntriesByType("resource")
      .map((entry) => entry.name)
      .filter((url) => /\/src\/(?:components|elements)\/.*\.ts$/.test(url)),
  );
  expect(sourceRequests).toEqual([]);

  const root = page.locator("[ng-dialog]");
  const trigger = root.locator(".dialog-trigger");
  const content = root.locator(".dialog-content");
  await expect(content).toBeHidden();
  await trigger.click();
  await expect(content).toBeVisible();
  expect(await content.getAttribute("role")).toBeNull();
  await page.keyboard.press("Escape");
  await expect(content).toBeHidden();
  await expect(trigger).toBeFocused();
});
