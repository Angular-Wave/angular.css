import { expect, test } from "@playwright/test";

test("badge normalizes default variant into data-variant", async ({ page }) => {
  await page.goto("/docs/static/examples/components/badge.html");

  await expect(page.locator("[ng-badge]").first()).toHaveAttribute(
    "data-variant",
    "default",
  );
});

test("badge preserves explicit variant", async ({ page }) => {
  await page.goto("/docs/static/examples/components/badge.html");

  await expect(page.locator('[ng-badge][variant="outline"]')).toHaveAttribute(
    "data-variant",
    "outline",
  );
});
