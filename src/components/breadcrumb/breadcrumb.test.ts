import { expect, test, type Page } from "@playwright/test";

const canonicalUrl = "/docs/static/examples/components/breadcrumb.html";
const workflowsUrl =
  "/docs/static/examples/components/breadcrumb-workflows.html";

const expectBuiltArtifactRuntime = async (page: Page): Promise<void> => {
  await expect(
    page.locator('script[src$="/js/angular-ts.umd.js"]'),
  ).toHaveCount(1);
  await expect(
    page.locator('script[src$="/js/angular-css.umd.js"]'),
  ).toHaveCount(1);
  const sourceRequests = await page.evaluate(() =>
    performance
      .getEntriesByType("resource")
      .map((entry) => entry.name)
      .filter((url) => /\/src\/(?:components|elements)\/.*\.ts$/.test(url)),
  );
  expect(sourceRequests).toEqual([]);
};

test("canonical artifact supplies breadcrumb, list, item, and current-page semantics", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  await expectBuiltArtifactRuntime(page);
  const root = page.locator("[ng-breadcrumb]");
  const list = page.locator("[data-slot=breadcrumb-list]");
  const items = page.locator("[data-slot=breadcrumb-item]");
  const separators = page.locator("[data-slot=breadcrumb-separator]");
  const current = page.locator("[data-slot=breadcrumb-page]");

  await expect(root).toHaveAttribute("aria-label", "breadcrumb");
  await expect(list).toHaveAttribute("role", "list");
  await expect(items).toHaveCount(3);
  await expect(items.first()).toHaveAttribute("role", "listitem");
  await expect(separators).toHaveCount(2);
  await expect(separators.first()).toHaveAttribute("role", "presentation");
  await expect(separators.first()).toHaveAttribute("aria-hidden", "true");
  await expect(
    page.locator('[data-breadcrumb-generated="separator"]'),
  ).toHaveCount(2);
  await expect(current).toHaveAttribute("role", "link");
  await expect(current).toHaveAttribute("aria-disabled", "true");
  await expect(current).toHaveAttribute("aria-current", "page");
});

test("workflow artifact preserves custom separators and supplies ellipsis icons", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  await expectBuiltArtifactRuntime(page);
  const custom = page
    .getByRole("heading", { name: "Custom separator" })
    .locator("..")
    .locator("[data-slot=breadcrumb-separator]");
  const ellipsisSection = page
    .getByRole("heading", { name: "Ellipsis" })
    .locator("..")
    .locator("[data-slot=breadcrumb-ellipsis]");

  await expect(custom).toHaveCount(2);
  await expect(custom.locator("svg circle")).toHaveCount(2);
  await expect(
    custom.locator('[data-breadcrumb-generated="separator"]'),
  ).toHaveCount(0);
  await expect(ellipsisSection).toHaveCount(1);
  await expect(ellipsisSection).toHaveAttribute("role", "presentation");
  await expect(ellipsisSection).toHaveAttribute("aria-hidden", "true");
  await expect(
    ellipsisSection.locator('[data-breadcrumb-generated="ellipsis"]'),
  ).toHaveCount(1);
});

test("packaged directive synchronizes dynamic items and preserves an explicit current page", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  await expectBuiltArtifactRuntime(page);
  const list = page.locator("[data-slot=breadcrumb-list]");
  const originalCurrent = page.getByRole("link", {
    name: "Breadcrumb",
    exact: true,
  });

  await list.evaluate((element) => {
    element.insertAdjacentHTML(
      "beforeend",
      `<li data-slot="breadcrumb-separator"></li>
       <li data-slot="breadcrumb-item">
         <span data-slot="breadcrumb-page">Installation</span>
       </li>`,
    );
  });
  const items = page.locator("[data-slot=breadcrumb-item]");
  const pages = page.locator("[data-slot=breadcrumb-page]");
  await expect(items).toHaveCount(4);
  await expect(items.last()).toHaveAttribute("role", "listitem");
  await expect(originalCurrent).not.toHaveAttribute("aria-current");
  await expect(pages.last()).toHaveAttribute("aria-current", "page");

  await list.evaluate((element) => {
    element.insertAdjacentHTML(
      "afterbegin",
      `<li data-slot="breadcrumb-item">
         <span data-slot="breadcrumb-page" aria-current="step">Guide</span>
       </li>`,
    );
  });
  const explicit = pages.first();
  await expect(explicit).toHaveAttribute("aria-current", "step");
  await expect(pages.last()).not.toHaveAttribute("aria-current");
});
