import { expect, test } from "@playwright/test";

test("toggle-group element example uses native radios", async ({ page }) => {
  await page.goto("/docs/static/examples/elements/toggle-group.html");
  const left = page.getByRole("radio", { name: "Left" });

  await left.check();
  await expect(left).toBeChecked();
  await expect(page.locator(".output")).toContainText("Alignment: left");
});
