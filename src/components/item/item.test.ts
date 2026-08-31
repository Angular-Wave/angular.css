import { expect, test } from "@playwright/test";

const exampleUrl = "/docs/static/examples/components/item.html";

test("item exposes default variant and disabled state", async ({ page }) => {
  await page.goto(exampleUrl);

  const item = page.locator("#disabled-item");
  await expect(item).toHaveAttribute("data-variant", "default");
  await expect(item).toHaveAttribute("data-disabled", "true");
  await expect(item).toHaveAttribute("aria-disabled", "true");
});

test("item preserves explicit variant and compact size", async ({ page }) => {
  await page.goto(exampleUrl);

  await expect(page.locator("#outline-item")).toHaveAttribute(
    "data-variant",
    "outline",
  );
  await expect(page.locator("#outline-item")).toHaveAttribute(
    "data-size",
    "default",
  );
  await expect(page.locator("#compact-item")).toHaveAttribute(
    "data-size",
    "sm",
  );
});

test("item workflows preserve media, groups, variants, uploads, and RTL", async ({
  page,
}) => {
  await page.setViewportSize({ height: 2600, width: 1100 });
  await page.goto("/docs/static/examples/components/item-workflows.html");

  await expect(page.locator("[data-example]")).toHaveCount(14);
  expect(await page.locator("[ng-item]").count()).toBeGreaterThan(30);

  const defaultSize = page
    .locator("[data-example='item-size'] [ng-item]")
    .first();
  const extraSmall = page
    .locator("[data-example='item-size'] [ng-item]")
    .last();
  await expect(defaultSize).toHaveCSS("padding-top", "10px");
  await expect(defaultSize).toHaveCSS("padding-left", "12px");
  await expect(extraSmall).toHaveCSS("padding-top", "8px");
  await expect(extraSmall).toHaveCSS("padding-left", "10px");

  const iconMedia = page.locator(
    "[data-example='item-icon'] [data-slot='item-media']",
  );
  await expect(iconMedia).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  expect((await iconMedia.locator("svg").boundingBox())?.width).toBe(16);

  await page
    .locator("[data-example='item-demo']")
    .getByRole("button", { name: "Action" })
    .click();
  await expect(page.locator(".item-workflow-output")).toHaveText(
    "Basic action",
  );

  const dropdown = page.locator("[data-example='item-dropdown']");
  await dropdown.getByRole("button", { name: /Select/ }).click();
  await dropdown.getByRole("menuitem", { name: /shadcn/ }).click();
  await expect(page.locator(".item-workflow-output")).toHaveText(
    "Selected shadcn",
  );

  await expect(page.locator("[data-example='item-link'] a")).toHaveCount(2);
  const uploads = page.locator(
    "[data-example='file-upload-list'] [ng-progress]",
  );
  await expect(uploads).toHaveCount(4);
  await expect(uploads.first()).toHaveAttribute("aria-valuenow", "45");
  await expect(page.locator("[data-example='item-rtl']")).toHaveAttribute(
    "dir",
    "rtl",
  );

  await page.mouse.move(1090, 2590);
  await expect(page.locator(".item-workflow-grid")).toHaveScreenshot(
    "item-workflows-desktop.png",
    { animations: "disabled" },
  );
});
