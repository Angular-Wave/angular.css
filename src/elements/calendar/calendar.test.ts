import { expect, test } from "@playwright/test";

test("calendar element page runs the packaged canonical artifact", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/elements/calendar.html");
  await expect(
    page.locator('script[src$="/js/angular-ts.umd.js"]'),
  ).toHaveCount(1);
  await expect(
    page.locator('script[src$="/js/angular-css.umd.js"]'),
  ).toHaveCount(1);
  expect(
    await page.evaluate(() =>
      performance
        .getEntriesByType("resource")
        .map((entry) => entry.name)
        .filter((url) => /\/src\/(?:components|elements)\/.*\.ts$/.test(url)),
    ),
  ).toEqual([]);

  const calendar = page.locator("[ng-calendar]");
  await expect(calendar.locator(".calendar-day")).toHaveCount(42);
  await expect(calendar).toHaveAttribute("data-value", "2026-05-14");
  await calendar.locator('[data-value="2026-05-20"]').click();
  await expect(calendar).toHaveAttribute("data-value", "2026-05-20");
  await expect(page.locator(".output")).toHaveText("Selected: 2026-05-20");

  await page.getByRole("button", { name: "Next month" }).click();
  await expect(calendar).toHaveAttribute("data-month", "2026-06");
  await expect(page.getByRole("combobox", { name: "Month" })).toHaveValue("5");
});
