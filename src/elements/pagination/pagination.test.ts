import { expect, test } from "@playwright/test";

test("pagination element example exercises the built functional artifact", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/elements/pagination.html");
  await expect(
    page.locator('script[src="../../js/angular-ts.umd.js"]'),
  ).toHaveCount(1);
  await expect(
    page.locator('script[src="../../js/angular-css.umd.js"]'),
  ).toHaveCount(1);

  const pagination = page.getByRole("navigation", { name: "pagination" });
  await expect(pagination.locator("a:not([rel])")).toHaveCount(3);
  await expect(pagination.locator("[aria-current='page']")).toHaveText("2");
  await expect(
    pagination.getByRole("link", { name: "Go to previous page" }),
  ).toBeVisible();

  const sourceRequests = await page.evaluate(() =>
    performance
      .getEntriesByType("resource")
      .map((entry) => entry.name)
      .filter((url) => /\/src\/(?:components|elements)\/.*\.ts$/.test(url)),
  );
  expect(sourceRequests).toEqual([]);
});
