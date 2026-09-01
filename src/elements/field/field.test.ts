import { expect, test } from "@playwright/test";

test("element field combines authored descriptions with AngularTS visibility", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/elements/field.html");

  const field = page.locator(".field").filter({
    has: page.locator("#demo-profile-email"),
  });
  const input = page.locator("#demo-profile-email");
  const error = field.locator(".field-error");

  await expect(error).toBeVisible();
  await expect(input).toHaveAttribute(
    "aria-describedby",
    "demo-profile-email-error",
  );

  await input.fill("jane@example.com");
  await expect(error).toBeHidden();
  expect(
    await input.evaluate((control: HTMLInputElement) =>
      control.checkValidity(),
    ),
  ).toBe(true);

  await input.fill("");
  await expect(error).toBeVisible();
  expect(
    await input.evaluate((control: HTMLInputElement) =>
      control.checkValidity(),
    ),
  ).toBe(false);
});
