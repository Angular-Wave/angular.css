import { expect, test } from "@playwright/test";

test("element alert-dialog page runs the packaged canonical artifact", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/elements/alert-dialog.html");
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

  const root = page.locator(".alert-dialog");
  const trigger = root.locator(":scope > button:first-child");
  const content = root.locator(":scope > dialog");
  await trigger.click();
  await expect(content).toBeVisible();
  await root.getByRole("button", { name: "Cancel" }).click();
  await expect(content).toBeHidden();
  await expect(trigger).toBeFocused();
});
