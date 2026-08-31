import { expect, test } from "@playwright/test";

test("alert default state matches the reference alert semantics", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/components/alert.html");

  const alert = page.locator("[ng-alert]").first();
  await expect(alert).toHaveAttribute("role", "alert");
  await expect(alert).toHaveAttribute("data-variant", "default");
  await expect(alert).toHaveAttribute("aria-live", "assertive");
  await expect(alert).toHaveAttribute("aria-atomic", "true");
});

test("alert supports custom roles unless already provided", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/components/alert-workflows.html");

  const alert = page.locator(".alert-action-demo");
  await expect(alert).toHaveAttribute("role", "status");
  await expect(alert).toHaveAttribute("aria-live", "polite");
});

test("alert applies alert semantics independently of visual variant", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/components/alert-workflows.html");

  const alert = page.locator(".alert-warning-demo");
  await expect(alert).toHaveAttribute("data-variant", "warning");
  await expect(alert).toHaveAttribute("role", "alert");
  await expect(alert).toHaveAttribute("aria-live", "assertive");
});

test("alert preserves user-provided alerting attributes", async ({ page }) => {
  await page.goto("/docs/static/examples/components/alert-workflows.html");

  const alert = page.locator(".alert-action-demo");
  await expect(alert).toHaveAttribute("role", "status");
  await expect(alert).toHaveAttribute("aria-live", "polite");
});
