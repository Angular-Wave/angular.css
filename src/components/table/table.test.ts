import { expect, test } from "@playwright/test";

test("table exposes row and column metadata with native header scopes", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/components/table.html");

  const table = page.locator("[ng-table]");
  await expect(table).toHaveAttribute("data-row-count", "3");
  await expect(table).toHaveAttribute("data-column-count", "4");

  const rowHeaders = page.locator(
    ':is([data-slot="table-body"], [ng-table-body]) th',
  );
  await expect(rowHeaders).toHaveCount(3);
  await expect(rowHeaders.first()).toHaveAttribute("scope", "row");
  await expect(
    page.locator(':is([data-slot="table-head"], [ng-table-head])').first(),
  ).toHaveAttribute("scope", "col");
});

test("table workflows preserve invoices, actions, data controls, and RTL", async ({
  page,
}) => {
  await page.setViewportSize({ height: 2400, width: 1100 });
  await page.goto("/docs/static/examples/components/table-workflows.html");

  const invoices = page.locator("[data-example~='table-demo']");
  await expect(invoices.locator("tbody tr")).toHaveCount(7);
  await expect(invoices.locator("tfoot")).toContainText("$2,500.00");

  const actions = page.locator("[data-example='table-actions']");
  await actions
    .getByRole("button", { name: "Open menu for Wireless Mouse" })
    .click();
  await actions
    .locator(".table-action-menu")
    .first()
    .getByRole("menuitem", { name: "Delete" })
    .click();
  await expect(page.locator(".table-workflow-output")).toHaveText(
    "Delete Wireless Mouse",
  );

  const dataTable = page.locator("[data-example='data-table-demo']");
  await dataTable.getByLabel("Filter payment emails").fill("ken99");
  await expect(dataTable.locator("tbody tr")).toHaveCount(1);
  await dataTable.getByLabel("Filter payment emails").fill("");
  await expect(dataTable.locator("tbody tr")).toHaveCount(5);
  await dataTable.getByLabel("Select ken99@example.com").click();
  await expect(
    dataTable.locator("tbody tr").filter({ hasText: "ken99@example.com" }),
  ).toHaveAttribute("data-state", "selected");
  await expect(dataTable.locator(".data-table-footer p")).toHaveText(
    "1 of 5 row(s) selected.",
  );
  await dataTable.getByLabel("Select ken99@example.com").click();

  await dataTable.getByRole("button", { name: /Columns/ }).click();
  await dataTable.getByRole("menuitemcheckbox", { name: "Amount" }).click();
  await expect(
    dataTable.getByRole("columnheader", { name: "Amount" }),
  ).toHaveCount(0);
  await dataTable.getByRole("button", { name: /Columns/ }).click();
  await dataTable.getByRole("menuitemcheckbox", { name: "Amount" }).click();
  await expect(
    dataTable.getByRole("columnheader", { name: "Amount" }),
  ).toHaveCount(1);

  await expect(
    page.locator("[data-example='table-rtl']"),
  ).toHaveAttribute("dir", "rtl");
  await expect(
    page.locator("[data-example='data-table-rtl']"),
  ).toHaveAttribute("dir", "rtl");
  await page.mouse.move(1090, 2390);
  await expect(page.locator(".table-workflow-grid")).toHaveScreenshot(
    "table-workflows-desktop.png",
    { animations: "disabled" },
  );
});
