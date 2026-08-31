import { expect, test } from "@playwright/test";

test("switch directive sets role and checked state", async ({ page }) => {
  await page.goto("/docs/static/examples/components/switch.html");

  const switchInput = page.locator("#airplane-mode");
  await expect(switchInput).toHaveAttribute("role", "switch");
  await switchInput.check();
  await expect(switchInput).toHaveAttribute("data-state", "checked");
  await expect(switchInput).toHaveAttribute("aria-checked", "true");
});

test("switch directive supports button toggles", async ({ page }) => {
  await page.goto("/docs/static/examples/components/switch-workflows.html");

  const switchButton = page.locator("#switch-button-control");
  await expect(switchButton).toHaveAttribute("role", "switch");
  await expect(switchButton).toHaveAttribute("data-state", "unchecked");

  await switchButton.click();
  await expect(switchButton).toHaveAttribute("aria-checked", "true");
  await expect(switchButton).toHaveAttribute("data-state", "checked");

  await switchButton.press("Space");
  await expect(switchButton).toHaveAttribute("aria-checked", "false");
  await expect(switchButton).toHaveAttribute("data-state", "unchecked");
});

test("switch directive mirrors input invalid state", async ({ page }) => {
  await page.goto("/docs/static/examples/components/switch.html");

  const switchInput = page.locator("#airplane-mode");
  await switchInput.evaluate((element) => {
    element.setAttribute("required", "");
  });
  await expect(switchInput).toHaveAttribute("data-invalid", "true");

  await switchInput.check();
  await expect(switchInput).toHaveAttribute("data-invalid", "false");

  await switchInput.evaluate((element) => {
    element.setAttribute("aria-invalid", "true");
  });
  await expect(switchInput).toHaveAttribute("data-invalid", "true");
});

test("switch directive updates input native state attributes dynamically", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/components/switch.html");

  const switchInput = page.locator("#airplane-mode");
  await switchInput.evaluate((element) => {
    element.setAttribute("required", "");
    element.setAttribute("disabled", "");
  });

  await expect(switchInput).toHaveAttribute("data-required", "true");
  await expect(switchInput).toHaveAttribute("aria-required", "true");
  await expect(switchInput).toHaveAttribute("data-disabled", "true");
  await expect(switchInput).toHaveAttribute("aria-disabled", "true");

  await switchInput.evaluate((element) => {
    element.removeAttribute("required");
    element.removeAttribute("disabled");
  });

  await expect(switchInput).toHaveAttribute("data-required", "false");
  await expect(switchInput).not.toHaveAttribute("aria-required");
  await expect(switchInput).toHaveAttribute("data-disabled", "false");
  await expect(switchInput).not.toHaveAttribute("aria-disabled");
});

test("switch directive mirrors button invalid state", async ({ page }) => {
  await page.goto("/docs/static/examples/components/switch-workflows.html");

  const switchButton = page.locator("#switch-button-control");
  await expect(switchButton).toHaveAttribute("data-invalid", "false");

  await switchButton.evaluate((element) => {
    element.setAttribute("aria-invalid", "true");
  });
  await expect(switchButton).toHaveAttribute("data-invalid", "true");
});
