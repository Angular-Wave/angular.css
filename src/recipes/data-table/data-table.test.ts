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
  await expect(rows.first().locator("th").last()).toHaveText("ORD-1045");

  await page.getByRole("searchbox", { name: "Search orders" }).fill("Missing");
  await expect(rows).toHaveCount(0);
  await expect(page.locator(".data-table > figure > p")).toHaveText(
    "No matching orders.",
  );
  await expect(page.locator(".data-table > footer output")).toHaveText(
    "0 orders",
  );
});

test("data table composes backend loading, error, stale, paging, selection, bulk, and permission states", async ({
  page,
}) => {
  await page.goto("/src/recipes/data-table/data-table.html");
  const root = page.locator(".data-table");

  await expect(root.locator('aside[aria-live="polite"]')).toContainText(
    "cached orders",
  );
  await root.getByRole("checkbox", { name: "Select ORD-1048" }).check();
  const bulkActions = root.locator('menu[aria-label="Selected order actions"]');
  await expect(bulkActions).toBeVisible();
  await expect(
    bulkActions.getByRole("button", { name: "Archive" }),
  ).toBeDisabled();
  await expect(root.getByText("cannot archive them")).toBeVisible();

  await root.getByRole("link", { name: "2", exact: true }).click();
  await expect(
    root.getByRole("link", { name: "2", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await expect(root.locator("tbody tr").filter({ visible: true })).toHaveCount(
    2,
  );

  await root.evaluate(() => {
    const scope = window.angular.getScope(document.body) as ng.Scope & {
      state: { error: boolean; loading: boolean };
    };
    scope.state.loading = true;
  });
  await expect(root).toHaveAttribute("aria-busy", "true");
  await expect(root.getByLabel("Loading orders")).toBeVisible();

  await root.evaluate(() => {
    const scope = window.angular.getScope(document.body) as ng.Scope & {
      state: { error: boolean; loading: boolean };
    };
    scope.state.loading = false;
    scope.state.error = true;
  });
  await expect(root.locator('aside[aria-live="assertive"]')).toContainText(
    "could not be loaded",
  );
  await root.getByRole("button", { name: "Retry" }).click();
  await expect(root).toHaveAttribute("aria-busy", "true");
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
