import { expect, test } from "@playwright/test";

test("spinner supplies default loading status attributes", async ({ page }) => {
  await page.goto("/docs/static/examples/components/spinner.html");

  const spinner = page.locator("[ng-spinner]");
  await expect(spinner).toHaveAttribute("role", "status");
  await expect(spinner).toHaveAttribute("aria-live", "polite");
  await expect(spinner).toHaveAttribute("aria-label", "Loading");
  await expect(spinner).toHaveAttribute("aria-busy", "true");
  await expect(spinner).toHaveAttribute("data-loading", "true");
});

test("spinner preserves explicit accessibility attributes", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/components/spinner-workflows.html");

  const spinner = page.locator("#processing-spinner");
  await expect(spinner).toHaveAttribute("role", "img");
  await expect(spinner).toHaveAttribute("aria-live", "assertive");
  await expect(spinner).toHaveAttribute("aria-label", "Processing data");
  await expect(spinner).toHaveAttribute("aria-busy", "true");
});
