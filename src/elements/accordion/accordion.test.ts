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
  const root = page.locator("[ng-accordion]");
  const triggers = page.locator(
    `:is([data-slot=accordion-trigger], [ng-accordion-trigger])`,
  );
  const panels = page.locator(
    `:is([data-slot=accordion-content], [ng-accordion-content])`,
  );

  await expect(root).not.toHaveAttribute("data-slot");
  await expect(triggers).toHaveCount(3);
  await triggers.nth(1).click();
  await expect(triggers.nth(0)).toHaveAttribute("aria-expanded", "false");
  await expect(triggers.nth(1)).toHaveAttribute("aria-expanded", "true");
  await expect(panels.nth(1)).toHaveAttribute("data-open", "true");

  const sourceRequests = await page.evaluate(() =>
    performance
      .getEntriesByType("resource")
      .map((entry) => entry.name)
      .filter((url) => /\/src\/(?:components|elements)\/.*\.ts$/.test(url)),
  );
  expect(sourceRequests).toEqual([]);
});
