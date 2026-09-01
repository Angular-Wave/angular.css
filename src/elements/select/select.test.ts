import { expect, test } from "@playwright/test";

const elementUrl = "/docs/static/examples/elements/select.html";

test("element artifact uses bundled entrypoints and remains functional", async ({
  page,
}) => {
  await page.goto(elementUrl);
  await expect(
    page.locator('script[src="../../js/angular-ts.umd.js"]'),
  ).toHaveCount(1);
  await expect(
    page.locator('script[src="../../js/angular-css.umd.js"]'),
  ).toHaveCount(1);
  expect(
    await page.evaluate(() =>
      performance
        .getEntriesByType("resource")
        .map((entry) => entry.name)
        .filter((url) => /\/src\/(?:components|elements)\/.*\.ts$/.test(url)),
    ),
  ).toEqual([]);

  const root = page.locator("[ng-select]");
  const trigger = page.locator(".select-trigger");
  const content = page.locator(".select-content");
  await expect(content).toBeHidden();
  await trigger.focus();
  await trigger.press("ArrowDown");
  await trigger.press("End");
  await expect(content).toBeVisible();
  await expect(page.locator(".select-item").last()).toHaveAttribute(
    "data-highlighted",
    "true",
  );
  await trigger.press("Enter");
  await expect(root).toHaveAttribute("data-value", "pineapple");
  await expect(page.locator(".select-value")).toHaveText("Pineapple");
  await expect(page.locator(".output")).toContainText("Selected: pineapple");
});
