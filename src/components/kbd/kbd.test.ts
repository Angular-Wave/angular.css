import { expect, test } from "@playwright/test";

test("kbd sets aria-label from text content when missing", async ({ page }) => {
  await page.goto("/docs/static/examples/components/kbd.html");

  await expect(page.locator("[ng-kbd]").first()).toHaveAttribute(
    "aria-label",
    "Keyboard shortcut Ctrl",
  );
});

test("kbd keeps existing aria-label", async ({ page }) => {
  await page.goto("/docs/static/examples/components/kbd.html");

  await expect(page.locator('[ng-kbd][aria-label="Slash"]')).toHaveAttribute(
    "aria-label",
    "Slash",
  );
});

test("kbd reference compositions work in buttons, input groups, tooltips, and RTL", async ({
  page,
}) => {
  await page.setViewportSize({ height: 560, width: 640 });
  await page.goto("/docs/static/examples/components/kbd.html");
  await page.getByRole("button", { name: /Save changes/ }).click();
  await expect(page.getByRole("status")).toHaveText("Saved");
  await page.getByRole("button", { name: "Keyboard help" }).focus();
  await expect(page.getByRole("tooltip")).toBeVisible();
  await expect(page.locator(".kbd-workflows")).toHaveScreenshot(
    "kbd-workflows-desktop.png",
    { animations: "disabled" },
  );
});
