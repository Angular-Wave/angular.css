import { expect, test } from "@playwright/test";

test("toggle-group element example exercises the built functional artifact", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/elements/toggle-group.html");
  const group = page.locator("[ng-toggle-group]");
  const items = group.locator('[data-slot="toggle-group-item"]');

  await expect(items).toHaveCount(3);
  await expect(items.nth(1)).toHaveAttribute("data-state", "on");
  await items.nth(0).click();
  await expect(items.nth(0)).toHaveAttribute("aria-pressed", "true");
  await expect(items.nth(1)).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator(".output")).toContainText("Alignment: left");
});
