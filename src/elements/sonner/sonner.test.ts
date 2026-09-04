import { expect, test } from "@playwright/test";

test("Sonner element example exercises the canonical built artifact", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/elements/sonner.html");

  const toaster = page.locator("[ng-toaster]");
  const toast = toaster.locator(":scope > article");
  await expect(toaster).toHaveAttribute("position", "bottom-right");
  await expect(toast).toHaveCount(0);

  await page.getByRole("button", { name: "Show Toast" }).click();
  await expect(toast).toHaveCount(1);
  await expect(toast).toHaveAttribute("role", "status");
  await expect(toast).toHaveAttribute("aria-live", "polite");
  await expect(toast).toBeVisible();
  await expect(page.getByRole("button", { name: "Undo" })).toHaveAttribute(
    "type",
    "button",
  );
});
