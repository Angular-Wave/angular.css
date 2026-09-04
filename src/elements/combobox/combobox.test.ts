import { expect, test, type Page } from "@playwright/test";

const artifactUrl = "/docs/static/examples/elements/combobox.html";

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

test("element artifact runs the packaged combobox without source construction", async ({
  page,
}) => {
  await page.goto(artifactUrl);
  await expectBuiltArtifactRuntime(page);

  const roots = page.locator("[ng-combobox]");
  const basic = page.locator("#basic-combobox");
  const automatic = page.locator("#auto-combobox");
  await expect(roots).toHaveCount(2);
  await expect(basic.locator(":scope > aside")).toBeHidden();

  const basicInput = basic.getByRole("combobox");
  await basicInput.fill("sv");
  await expect(basic.getByRole("option")).toHaveCount(1);
  await basicInput.press("ArrowDown");
  await basicInput.press("Enter");
  await expect(basicInput).toHaveValue("SvelteKit");

  const automaticInput = automatic.getByRole("combobox");
  await automaticInput.focus();
  await expect(automatic.getByRole("option").first()).toHaveAttribute(
    "data-highlighted",
    "true",
  );
  await automaticInput.press("End");
  await automaticInput.press("Enter");
  await expect(automaticInput).toHaveValue("Astro");
  await expect(page.locator(".output")).toContainText("Automatic: Astro");
});
