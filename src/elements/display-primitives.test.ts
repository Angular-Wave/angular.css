import { expect, test } from "@playwright/test";

test("published skeleton example exposes decorative and labeled loading states", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/elements/skeleton.html");

  const decorative = page.locator("#decorative-skeleton");
  const labeled = page.locator("#labeled-skeleton");
  await expect(decorative).toHaveAttribute("aria-hidden", "true");
  await expect(labeled).not.toHaveAttribute("aria-hidden", "true");
  await expect(labeled).toHaveAttribute("aria-label", "Loading avatar");
});

test("published spinner example exposes labeled loading state", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/elements/spinner.html");

  const spinner = page.locator(".spinner");
  expect(await spinner.getAttribute("role")).toBeNull();
  await expect(spinner).toHaveAttribute("aria-live", "polite");
  await expect(spinner).toHaveAttribute("aria-label", "Loading");
  await expect(spinner).toHaveAttribute("aria-busy", "true");
});

test("published table example records row count and column scopes", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/elements/table.html");

  await expect(page.locator("tbody tr")).toHaveCount(3);
  await expect(page.locator("thead th")).toHaveCount(4);
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
