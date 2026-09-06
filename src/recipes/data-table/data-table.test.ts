import { expect, test } from "@playwright/test";

import { testStyleOnlyElement } from "../../testing/style-only-element";

testStyleOnlyElement({
  category: "recipes",
  directive: "ngDataTable",
  name: "data-table",
  selector: ".data-table",
});

test("data table delegates filtering and sorting to AngularTS", async ({
  page,
}) => {
  await page.goto("/src/recipes/data-table/data-table.html");
  const rows = page.locator("tbody tr").filter({ visible: true });
  await page.getByRole("searchbox", { name: "Search orders" }).fill("Grace");
  await expect(rows).toHaveCount(1);
  await expect(rows).toContainText("Grace Hopper");
  await page.getByRole("searchbox", { name: "Search orders" }).fill("");
  await page.getByRole("button", { name: "Order" }).click();
  await expect(rows.first().locator("th")).toHaveText("ORD-1046");

  await page.getByRole("searchbox", { name: "Search orders" }).fill("Missing");
  await expect(rows).toHaveCount(0);
  await expect(page.locator(".data-table > figure > p")).toHaveText(
    "No matching orders.",
  );
  await expect(page.locator(".data-table > footer > output")).toHaveText(
    "0 orders",
  );
});

test("data table contains wide columns in its native scroll region", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 700 });
  await page.goto("/src/recipes/data-table/data-table.html");
  const figure = page.locator(".data-table > figure");

  await expect
    .poll(() =>
      figure.evaluate((element) => ({
        hasOverflow: element.scrollWidth > element.clientWidth,
        overflow: getComputedStyle(element).overflowX,
        pageOverflow:
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      })),
    )
    .toEqual({ hasOverflow: true, overflow: "auto", pageOverflow: 0 });
});
