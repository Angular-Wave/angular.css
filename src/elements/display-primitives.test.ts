import { expect, test } from "@playwright/test";

test("published skeleton example exposes decorative and labeled loading states", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/elements/skeleton.html");

  const decorative = page.locator("#decorative-skeleton");
  const labeled = page.locator("#labeled-skeleton");
  await expect(decorative).toHaveAttribute("aria-hidden", "true");
  await expect(decorative).toHaveAttribute("data-loading", "true");
  await expect(labeled).not.toHaveAttribute("aria-hidden", "true");
  await expect(labeled).toHaveAttribute("aria-label", "Loading avatar");
  await expect(labeled).toHaveAttribute("data-loading", "true");
});

test("published spinner example exposes status semantics", async ({ page }) => {
  await page.goto("/docs/static/examples/elements/spinner.html");

  const spinner = page.locator("[ng-spinner]");
  await expect(spinner).toHaveAttribute("role", "status");
  await expect(spinner).toHaveAttribute("aria-live", "polite");
  await expect(spinner).toHaveAttribute("aria-label", "Loading");
  await expect(spinner).toHaveAttribute("aria-busy", "true");
  await expect(spinner).toHaveAttribute("data-loading", "true");
});

test("published table example records row count and column scopes", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/elements/table.html");

  const table = page.locator("[ng-table]");
  await expect(table).toHaveAttribute("data-row-count", "3");
  await expect(table).toHaveAttribute("data-column-count", "4");
  await expect(page.locator("thead th").first()).toHaveAttribute(
    "scope",
    "col",
  );
  await expect(page.locator("tbody th")).toHaveCount(3);
  await expect(page.locator("tbody th").first()).toHaveAttribute(
    "scope",
    "row",
  );
});
