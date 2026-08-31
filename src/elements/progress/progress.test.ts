import { expect, test } from "@playwright/test";

test("progress element entrypoint exercises the built functional artifact", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/elements/progress.html");
  await expect(
    page.locator('script[src="../../js/angular-ts.umd.js"]'),
  ).toHaveCount(1);
  await expect(
    page.locator('script[src="../../js/angular-css.umd.js"]'),
  ).toHaveCount(1);

  const timed = page.locator(".progress-demo-timed");
  await expect(timed).toHaveAttribute("aria-valuenow", "66");
  await expect(timed).toHaveAttribute("data-value", "66");
  await expect(page.locator(".progress-demo-labeled")).toHaveAccessibleName(
    "Upload progress",
  );

  const sourceRequests = await page.evaluate(() =>
    performance
      .getEntriesByType("resource")
      .map((entry) => entry.name)
      .filter((url) => /\/src\/(?:components|elements)\/.*\.ts$/.test(url)),
  );
  expect(sourceRequests).toEqual([]);
});
