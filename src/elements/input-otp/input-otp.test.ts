import { expect, test } from "@playwright/test";

test("input otp element example mirrors the functional six-slot component page", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/elements/input-otp.html");
  const root = page.locator("[ng-input-otp]");
  const inputs = page.locator(`.input-otp-slot input`);

  await expect(inputs).toHaveCount(6);
  await expect(root).toHaveAttribute("data-value", "123456");
  await inputs.nth(0).fill("9");
  await expect(inputs.nth(1)).toBeFocused();
  await expect(root).toHaveAttribute("data-value", "923456");
  await expect(page.getByRole("status")).toContainText("Code: 923456");
});
