import { expect, test } from "@playwright/test";

test("separator functional page uses the minimal directive-only API", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/components/separator.html");
  const separators = page.locator("[ng-separator]");

  await expect(separators).toHaveCount(8);
  await expect(separators.first()).not.toHaveAttribute("data-slot");
  await expect(separators.first()).toHaveAttribute("role", "separator");
  await expect(separators.first()).toHaveAttribute(
    "aria-orientation",
    "horizontal",
  );
  await expect(separators.first()).toHaveAttribute(
    "data-orientation",
    "horizontal",
  );
  await expect(page.locator('[ng-separator][orientation="vertical"]')).toHaveCount(
    4,
  );
  await expect(
    page.locator('[ng-separator][orientation="vertical"]').first(),
  ).toHaveAttribute("aria-orientation", "vertical");
  await expect(
    page.locator('[ng-separator][orientation="vertical"]').first(),
  ).toHaveAttribute("data-orientation", "vertical");
});

test("separator reference layouts retain horizontal, vertical, list, menu, and RTL geometry", async ({
  page,
}) => {
  await page.setViewportSize({ height: 520, width: 940 });
  await page.goto("/docs/static/examples/components/separator.html");

  const horizontalBox = await page.locator("[ng-separator]").first().boundingBox();
  const verticalBox = await page
    .locator('[ng-separator][orientation="vertical"]')
    .first()
    .boundingBox();
  expect(horizontalBox).not.toBeNull();
  expect(verticalBox).not.toBeNull();
  expect(horizontalBox!.height).toBeCloseTo(1, 0);
  expect(verticalBox!.width).toBeCloseTo(1, 0);
  await expect(page.locator('[data-example="separator-rtl"]')).toHaveAttribute(
    "dir",
    "rtl",
  );
  await expect(page.locator(".separator-workflows")).toHaveScreenshot(
    "separator-workflows-desktop.png",
    { animations: "disabled" },
  );
});
