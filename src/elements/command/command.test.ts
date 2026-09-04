import { expect, test, type Page } from "@playwright/test";

const artifactUrl = "/docs/static/examples/elements/command.html";

const expectBuiltArtifactRuntime = async (page: Page): Promise<void> => {
  await expect(
    page.locator('script[src="../../js/angular-ts.umd.js"]'),
  ).toHaveCount(1);
  await expect(
    page.locator('script[src="../../js/angular-css.umd.js"]'),
  ).toHaveCount(1);
  expect(
    await page.evaluate(() =>
      performance
        .getEntriesByType("resource")
        .map((entry) => entry.name)
        .filter((url) => /\/src\/(?:components|elements)\/.*\.ts$/.test(url)),
    ),
  ).toEqual([]);
};

test("element artifact runs packaged Command behavior without source construction", async ({
  page,
}) => {
  await page.goto(artifactUrl);
  await expectBuiltArtifactRuntime(page);
  const root = page.locator("#command-demo");
  const input = root.getByRole("combobox");
  const options = root.getByRole("option");

  await expect(options).toHaveCount(6);
  await expect(options.first()).toHaveAttribute("aria-selected", "true");
  await input.press("ArrowDown");
  await input.press("ArrowDown");
  await expect(options.nth(2)).toHaveAttribute("aria-disabled", "true");
  await expect(options.nth(3)).toHaveAttribute("aria-selected", "true");

  await input.fill("Billing");
  await expect(options).toHaveCount(1);
  await input.press("Enter");
  await expect(page.locator(".output")).toContainText("Selected: Billing");

  await input.fill("missing");
  await expect(input).toHaveAttribute("aria-expanded", "false");
  await expect(root.locator(":scope > :last-child > p")).toBeVisible();
});
