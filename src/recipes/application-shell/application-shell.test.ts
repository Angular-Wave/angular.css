import { expect, test } from "@playwright/test";

import { testStyleOnlyElement } from "../../testing/style-only-element";

testStyleOnlyElement({
  category: "recipes",
  directive: "ngApplicationShell",
  name: "application-shell",
  selector: ".application-shell",
});

test("application shell composes the existing sidebar runtime", async ({
  page,
}) => {
  await page.goto("/src/recipes/application-shell/application-shell.html");
  await expect(
    page.getByRole("complementary", { name: "Primary navigation" }),
  ).toBeVisible();
  await expect(page.locator(".application-shell")).toHaveCSS("display", "grid");
});

test("application shell overlays its navigation on narrow screens", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/src/recipes/application-shell/application-shell.html");

  const shell = page.locator(".application-shell");
  const navigation = page.locator("[ng-sidebar]");
  const main = page.getByRole("main");

  await expect(navigation).toHaveCSS("position", "fixed");
  await expect(navigation).toHaveAttribute("collapsed", "");
  await expect(navigation).toHaveAttribute("aria-hidden", "true");
  await expect
    .poll(async () => {
      const shellBox = await shell.boundingBox();
      const mainBox = await main.boundingBox();
      return shellBox && mainBox
        ? Math.round(mainBox.width - shellBox.width)
        : null;
    })
    .toBe(0);

  await page.getByRole("button", { name: "Toggle navigation" }).click();
  await expect(navigation).not.toHaveAttribute("collapsed", "");
  await expect(navigation).toHaveAttribute("aria-hidden", "false");
});
