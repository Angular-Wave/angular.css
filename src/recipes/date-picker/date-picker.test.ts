import { expect, test } from "@playwright/test";

import { testStyleOnlyElement } from "../../testing/style-only-element";

testStyleOnlyElement({
  category: "recipes",
  directive: "ngDatePicker",
  name: "date-picker",
  selector: ".date-picker",
});

test("date picker composes native popover with Calendar", async ({ page }) => {
  await page.goto("/src/recipes/date-picker/date-picker.html");
  await page.locator("#delivery-date").click();
  await expect(page.locator("#delivery-date-calendar")).toBeVisible();
  await expect(page.locator("[ng-calendar] > div button[value]")).toHaveCount(
    42,
  );

  await page.locator('[ng-calendar] > div button[value="2026-09-12"]').click();
  await expect(page.locator("#delivery-date")).toContainText("2026-09-12");
  await expect(page.locator("[ng-calendar]")).toHaveAttribute(
    "data-value",
    "2026-09-12",
  );
});
