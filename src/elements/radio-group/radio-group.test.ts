import { expect, test } from "@playwright/test";

test("radio-group element example exercises the built functional artifact", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/elements/radio-group.html");
  await expect(
    page.locator('script[src="../../js/angular-ts.umd.js"]'),
  ).toHaveCount(1);
  await expect(
    page.locator('script[src="../../js/angular-css.umd.js"]'),
  ).toHaveCount(1);
  const group = page.locator("[ng-radio-group]");
  const radios = group.locator("input[type=radio]");

  await expect(group).toHaveAttribute("role", "radiogroup");
  await expect(radios.nth(1)).toBeChecked();
  await expect(radios.nth(1)).toHaveAttribute("data-state", "checked");

  await radios.nth(2).check();
  await expect(radios.nth(1)).toHaveAttribute("data-state", "unchecked");
  await expect(radios.nth(2)).toHaveAttribute("data-state", "checked");
  await expect(radios.nth(2)).toHaveAttribute("aria-checked", "true");

  const sourceRequests = await page.evaluate(() =>
    performance
      .getEntriesByType("resource")
      .map((entry) => entry.name)
      .filter((url) => /\/src\/(?:components|elements)\/.*\.ts$/.test(url)),
  );
  expect(sourceRequests).toEqual([]);
});
