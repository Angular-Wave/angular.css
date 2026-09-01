import { expect, test } from "@playwright/test";

test("input OTP element example is a native AngularTS-bound input", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/elements/input-otp.html");
  const input = page.getByLabel("One-time code");

  await expect(input).toHaveValue("123456");
  await expect(input).toHaveAttribute("autocomplete", "one-time-code");
  await input.fill("923456");
  await expect(page.getByRole("status")).toContainText("Code: 923456");
});
