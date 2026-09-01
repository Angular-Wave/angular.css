import { expect, test } from "@playwright/test";

test("toggle element example exercises the built functional artifact", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/elements/toggle.html");
  const toggle = page.getByRole("button", { name: "Toggle bold" });

  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".output")).toContainText("Bold: on");
});
