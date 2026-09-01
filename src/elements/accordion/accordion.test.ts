import { expect, test } from "@playwright/test";

test("accordion element example exercises the built functional artifact", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/elements/accordion.html");
  await expect(
    page.locator('script[src="../../js/angular-ts.umd.js"]'),
  ).toHaveCount(1);
  await expect(
    page.locator('script[src="../../js/angular-css.umd.js"]'),
  ).toHaveCount(1);
  const root = page.locator(".accordion");
  const items = root.locator(":scope > details");
  const triggers = root.locator(":scope > details > summary");

  await expect(triggers).toHaveCount(3);
  await triggers.nth(1).click();
  await expect(items.nth(0)).not.toHaveAttribute("open", "");
  await expect(items.nth(1)).toHaveAttribute("open", "");

  const sourceRequests = await page.evaluate(() =>
    performance
      .getEntriesByType("resource")
      .map((entry) => entry.name)
      .filter((url) => /\/src\/(?:components|elements)\/.*\.ts$/.test(url)),
  );
  expect(sourceRequests).toEqual([]);
});
