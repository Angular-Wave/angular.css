import { expect, test } from "@playwright/test";

test("resizable element entrypoint exercises the built functional artifact", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/elements/resizable.html");
  await expect(
    page.locator('script[src="../../js/angular-ts.umd.js"]'),
  ).toHaveCount(1);
  await expect(
    page.locator('script[src="../../js/angular-css.umd.js"]'),
  ).toHaveCount(1);

  const outer = page.locator("[ng-resizable-panel-group]").first();
  const panels = outer.locator(":scope > .resizable-panel");
  const handle = outer.locator(":scope > .resizable-handle");
  await expect(handle).toHaveAttribute("role", "separator");
  await expect(handle).toHaveAttribute("aria-orientation", "vertical");
  await expect(handle).toHaveAttribute("aria-valuenow", "1");
  await handle.press("ArrowRight");
  await expect(panels.first()).toHaveCSS("--panel-size", "1.25");
  await expect(handle).toHaveAttribute("aria-valuenow", "1.25");

  const sourceRequests = await page.evaluate(() =>
    performance
      .getEntriesByType("resource")
      .map((entry) => entry.name)
      .filter((url) => /\/src\/(?:components|elements)\/.*\.ts$/.test(url)),
  );
  expect(sourceRequests).toEqual([]);
});
