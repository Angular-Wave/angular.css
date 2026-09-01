import { expect, test } from "@playwright/test";

test("element field reacts to AngularTS error insertion and removal", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/elements/field.html");

  const field = page.locator("[ng-field]").filter({
    has: page.locator("#demo-profile-email"),
  });
  const input = page.locator("#demo-profile-email");
  const error = field.locator(".field-error");

  await expect(error).toBeVisible();
  await expect(field).toHaveAttribute("data-invalid", "true");
  await expect(input).toHaveAttribute("aria-describedby", /field-message-/);

  await input.fill("jane@example.com");
  await expect(error).toHaveCount(0);
  await expect(field).toHaveAttribute("data-invalid", "false");
  await expect(input).not.toHaveAttribute("aria-describedby", /.+/);

  await input.fill("");
  await expect(error).toBeVisible();
  await expect(field).toHaveAttribute("data-invalid", "true");
  await expect(input).toHaveAttribute("aria-describedby", /field-message-/);
});
