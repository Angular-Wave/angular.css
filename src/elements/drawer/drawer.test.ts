import { expect, test } from "@playwright/test";

test("element drawer page runs the packaged canonical artifact", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/elements/drawer.html");
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

  const root = page.locator(".drawer");
  const trigger = root.locator(".drawer-trigger");
  const content = root.locator(".drawer-content");
  await expect(content).toBeHidden();
  await trigger.click();
  await expect(content).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(content).toBeHidden();
  await expect(trigger).toBeFocused();
});
