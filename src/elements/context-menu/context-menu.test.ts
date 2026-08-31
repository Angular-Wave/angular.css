import { expect, test } from "@playwright/test";

test("element example runs packaged Context Menu behavior", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/elements/context-menu.html");
  await expect(
    page.locator('script[src$="/js/angular-ts.umd.js"]'),
  ).toHaveCount(1);
  await expect(
    page.locator('script[src$="/js/angular-css.umd.js"]'),
  ).toHaveCount(1);

  const root = page.locator("#context-menu-demo");
  const trigger = root.locator("[ng-context-menu-trigger]");
  const content = root.locator("[ng-context-menu-content]");
  await trigger.click({ button: "right" });
  await expect(content).toBeVisible();
  await expect(
    content.getByRole("menuitem", { name: /Forward/ }),
  ).toBeDisabled();
  await page.keyboard.press("Escape");
  await expect(content).toBeHidden();
  await expect(trigger).toBeFocused();

  const sourceRequests = await page.evaluate(() =>
    performance
      .getEntriesByType("resource")
      .map((entry) => entry.name)
      .filter((url) => /\/src\/(?:components|elements)\/.*\.ts$/.test(url)),
  );
  expect(sourceRequests).toEqual([]);
});
