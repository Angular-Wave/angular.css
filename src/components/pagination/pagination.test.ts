import { expect, test, type Page } from "@playwright/test";

const canonicalUrl = "/docs/static/examples/components/pagination.html";
const workflowsUrl =
  "/docs/static/examples/components/pagination-workflows.html";

const expectBuiltArtifactRuntime = async (page: Page): Promise<void> => {
  await expect(
    page.locator('script[src="../../js/angular-ts.umd.js"]'),
  ).toHaveCount(1);
  await expect(
    page.locator('script[src="../../js/angular-css.umd.js"]'),
  ).toHaveCount(1);
  const sourceRequests = await page.evaluate(() =>
    performance
      .getEntriesByType("resource")
      .map((entry) => entry.name)
      .filter((url) => /\/src\/(?:components|elements)\/.*\.ts$/.test(url)),
  );
  expect(sourceRequests).toEqual([]);
};

test("canonical pagination preserves native semantics and exact control anatomy", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  await expectBuiltArtifactRuntime(page);

  const pagination = page.getByRole("navigation", { name: "pagination" });
  const list = pagination.locator(":scope > [data-slot='pagination-content']");
  const items = list.locator(":scope > [data-slot='pagination-item']");
  const links = pagination.locator("[data-slot='pagination-link']");
  const previous = pagination.getByRole("link", {
    name: "Go to previous page",
  });
  const next = pagination.getByRole("link", { name: "Go to next page" });
  const ellipsis = pagination.locator("[data-slot='pagination-ellipsis']");

  await expect(pagination).not.toHaveAttribute("role");
  await expect(list).not.toHaveAttribute("role");
  await expect(items).toHaveCount(6);
  await expect(items.first()).not.toHaveAttribute("role");
  await expect(links).toHaveCount(3);
  await expect(links.nth(1)).toHaveAttribute("aria-current", "page");
  await expect(previous.locator("svg[data-icon='inline-start']")).toHaveCount(
    1,
  );
  await expect(next.locator("svg[data-icon='inline-end']")).toHaveCount(1);
  await expect(ellipsis.locator("svg")).toHaveCount(1);
  await expect(ellipsis.locator(".pagination-sr-only")).toHaveText(
    "More pages",
  );
  await expect(ellipsis).toHaveAttribute("aria-hidden", "true");
  await expect(ellipsis).not.toHaveAttribute("tabindex");

  for (const link of await links.all()) {
    expect((await link.boundingBox())?.height).toBe(32);
    expect((await link.boundingBox())?.width).toBe(32);
  }
  expect((await previous.boundingBox())?.height).toBe(32);
  expect((await next.boundingBox())?.height).toBe(32);
});

test("workflow keeps dynamic active and disabled state application-owned", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  await expectBuiltArtifactRuntime(page);

  const pagination = page.locator("#dynamic-pagination");
  const links = pagination.locator("[data-slot='pagination-link']");
  const next = pagination.getByRole("link", { name: "Go to next page" });
  await expect(links).toHaveCount(3);
  await expect(pagination.locator("[aria-current='page']")).toHaveCount(1);

  await page.getByRole("button", { name: "Add page 4" }).click();
  await expect(links).toHaveCount(4);
  await expect(links.nth(3)).toHaveAttribute("data-active", "true");
  await expect(links.nth(3)).toHaveAttribute("aria-current", "page");
  await expect(pagination.locator("[aria-current='page']")).toHaveCount(1);

  await links.nth(0).click();
  await expect(links.nth(0)).toHaveAttribute("aria-current", "page");
  await expect(links.nth(3)).not.toHaveAttribute("aria-current");

  await page.getByRole("button", { name: "Disable next" }).click();
  await expect(next).toHaveAttribute("aria-disabled", "true");
  await expect(next).toHaveAttribute("data-disabled", "true");
  await expect(next).toHaveCSS("pointer-events", "none");
});

test("simple and compact references retain links and native AngularTS row state", async ({
  page,
}) => {
  await page.goto(workflowsUrl);

  const simple = page.getByRole("navigation", { name: "Simple pagination" });
  const simpleLinks = simple.locator("[data-slot='pagination-link']");
  await expect(simpleLinks).toHaveCount(5);
  await expect(simpleLinks.nth(1)).toHaveAttribute("aria-current", "page");

  const rows = page.getByRole("combobox", { name: "Rows per page" });
  const compact = page.getByRole("navigation", {
    name: "Compact pagination",
  });
  await expect(rows.locator("option")).toHaveCount(4);
  await expect(rows).toHaveValue("25");
  await rows.selectOption("50");
  await expect(page.locator(".pagination-compact-section output")).toHaveText(
    "Rows: 50",
  );
  await expect(compact.getByRole("link")).toHaveCount(2);
  await expect(compact.getByText("Previous", { exact: true })).toHaveCount(0);
  await expect(compact.getByText("Next", { exact: true })).toHaveCount(0);
});

test("RTL reference preserves localized order and flips inline icons", async ({
  page,
}) => {
  await page.goto(workflowsUrl);

  const pagination = page.locator("#rtl-pagination");
  const previous = pagination.getByRole("link", {
    name: "الانتقال إلى الصفحة السابقة",
  });
  const next = pagination.getByRole("link", {
    name: "الانتقال إلى الصفحة التالية",
  });
  await expect(pagination).toHaveAttribute("dir", "rtl");
  await expect(pagination.locator("[aria-current='page']")).toHaveText("٢");

  const [previousBox, nextBox] = await Promise.all([
    previous.boundingBox(),
    next.boundingBox(),
  ]);
  expect(previousBox).not.toBeNull();
  expect(nextBox).not.toBeNull();
  expect(previousBox!.x).toBeGreaterThan(nextBox!.x);
  await expect(previous.locator("svg")).toHaveCSS(
    "transform",
    "matrix(-1, 0, 0, -1, 0, 0)",
  );
  await expect(next.locator("svg")).toHaveCSS(
    "transform",
    "matrix(-1, 0, 0, -1, 0, 0)",
  );
});
