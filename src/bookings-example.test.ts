import { expect, test } from "@playwright/test";

test("bookings example supports search, status filters, and details", async ({
  page,
}) => {
  await page.setViewportSize({ height: 1000, width: 1440 });
  const errors: string[] = [];
  const externalRequests: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (url.hostname !== "127.0.0.1") externalRequests.push(request.url());
  });

  await page.goto("/examples/bookings/");
  const visibleRows = page.locator(".booking-row:not(.ng-hide)");

  await expect(visibleRows).toHaveCount(8);
  await page.getByRole("searchbox").fill("Nora");
  await expect(visibleRows).toHaveCount(1);
  await expect(page.locator(".booking-result-count")).toHaveText("1 results");

  await page.getByRole("searchbox").fill("");
  await page.getByRole("tab", { name: "Pending", exact: true }).click();
  await expect(visibleRows).toHaveCount(2);
  await visibleRows.first().locator(".booking-row-trigger").click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("IRST-802072508");
  await expect(dialog).toContainText("Olivia Kim");
  await page.getByRole("button", { name: "Close" }).click();
  await expect(dialog).toBeHidden();

  await page.getByRole("tab", { name: "All", exact: true }).click();
  await expect(visibleRows).toHaveCount(8);
  await expect(page.locator(".booking-shell")).toHaveScreenshot(
    "bookings-desktop.png",
    { animations: "disabled" },
  );
  expect(errors).toEqual([]);
  expect(externalRequests).toEqual([]);
});

test("bookings example has a compact layout and mobile navigation", async ({
  page,
}) => {
  await page.setViewportSize({ height: 844, width: 390 });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/examples/bookings/");
  const shell = page.locator(".booking-shell");
  const sidebar = page.locator("#booking-sidebar");
  const menu = page.getByRole("button", {
    name: "Toggle booking navigation",
  });

  await expect(sidebar).toHaveAttribute("data-state", "collapsed");
  await expect(menu).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
  await expect(shell).toHaveScreenshot("bookings-mobile.png", {
    animations: "disabled",
  });

  await menu.click();
  await expect(sidebar).toHaveAttribute("data-state", "expanded");
  await expect(page.getByText("Emma Executive", { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});
