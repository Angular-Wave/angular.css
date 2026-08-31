import { expect, test } from "@playwright/test";

const statesUrl = "/docs/static/examples/components/card-state-workflows.html";

test("card exposes the presence of every optional section", async ({
  page,
}) => {
  await page.goto(statesUrl);

  const card = page.locator('[ng-card][aria-label="Complete card"]');
  await expect(card).toHaveAttribute("data-has-header", "true");
  await expect(card).toHaveAttribute("data-has-content", "true");
  await expect(card).toHaveAttribute("data-has-footer", "true");
  await expect(card).toHaveAttribute("data-has-action", "true");
});

test("card marks missing optional sections as absent", async ({ page }) => {
  await page.goto(statesUrl);

  const card = page.locator('[ng-card][aria-label="Minimal card"]');
  await expect(card).toHaveAttribute("data-has-header", "false");
  await expect(card).toHaveAttribute("data-has-content", "false");
  await expect(card).toHaveAttribute("data-has-footer", "false");
  await expect(card).toHaveAttribute("data-has-action", "false");
});

test("card normalizes the compact size contract", async ({ page }) => {
  await page.goto(statesUrl);

  await expect(
    page.locator('[ng-card][aria-label="Compact card"]'),
  ).toHaveAttribute("data-size", "sm");
});
