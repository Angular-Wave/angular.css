import { expect, test } from "@playwright/test";

test("Sonner element example exercises the canonical built artifact", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/elements/sonner.html");

  const toaster = page.locator("[ng-toaster]");
  const toast = page.locator(":is([data-slot=toast], [ng-toast])");
  await expect(toaster).toHaveAttribute("data-sonner-toaster", "");
  await expect(toaster).toHaveAttribute("data-position", "bottom-right");
  await expect(toast).toHaveCount(0);

  await page.getByRole("button", { name: "Show Toast" }).click();
  await expect(toast).toHaveCount(1);
  await expect(toast).toHaveAttribute("role", "status");
  await expect(toast).toHaveAttribute("aria-live", "polite");
  await expect(toast).toHaveAttribute("data-state", "open");
  await expect(page.getByRole("button", { name: "Undo" })).toHaveAttribute(
    "type",
    "button",
  );
});
