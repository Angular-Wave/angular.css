import { expect, test, type Page } from "@playwright/test";

const openElementArtifact = async (page: Page, component: string) => {
  await page.goto(`/docs/static/examples/elements/${component}.html`);
  await expect(
    page.locator('script[src$="/js/angular-ts.umd.js"]'),
  ).toHaveCount(1);
  await expect(
    page.locator('script[src$="/js/angular-css.umd.js"]'),
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

test("static feedback and display primitives run from packaged artifacts", async ({
  page,
}) => {
  await openElementArtifact(page, "alert");
  await expect(page.locator(".alert")).toHaveCount(2);
  expect(await page.locator(".alert").first().getAttribute("role")).toBeNull();
  await expect(page.locator(".alert").first()).toHaveAttribute(
    "aria-live",
    "assertive",
  );

  await openElementArtifact(page, "badge");
  await expect(page.getByText("Secondary", { exact: true })).toHaveAttribute(
    "variant",
    "secondary",
  );
  await expect(page.getByText("Outline", { exact: true })).toHaveAttribute(
    "variant",
    "outline",
  );

  await openElementArtifact(page, "button");
  await expect(page.getByRole("button", { name: "Button" })).toHaveAttribute(
    "variant",
    "outline",
  );
  await expect(page.getByRole("button", { name: "Submit" })).toHaveAttribute(
    "size",
    "icon",
  );
});

test("media and layout primitives expose their packaged state", async ({
  page,
}) => {
  await openElementArtifact(page, "aspect-ratio");
  const ratio = page.locator(".aspect-ratio");
  await expect(ratio).toHaveAttribute("ratio", "16 / 9");
  await expect(ratio).toHaveCSS("--ratio", "16 / 9");
  await expect(ratio.getByRole("img", { name: "Photo" })).toBeVisible();

  await openElementArtifact(page, "avatar");
  const avatars = page.locator(".avatar");
  await expect(avatars).toHaveCount(6);
  await expect(avatars.first().locator("img")).toBeVisible();
  await expect(page.locator(".avatar-group > output")).toHaveText("+3");

  await openElementArtifact(page, "direction");
  await expect(page.locator("#direction-default")).toHaveCSS(
    "direction",
    "ltr",
  );
  await expect(page.locator("#direction-rtl")).toHaveAttribute("dir", "rtl");
  await expect(page.locator("#direction-nested")).toHaveCSS("direction", "rtl");
});

test("navigation and data-display artifacts preserve generated semantics", async ({
  page,
}) => {
  await openElementArtifact(page, "breadcrumb");
  const breadcrumb = page.locator(".breadcrumb");
  await expect(breadcrumb).toHaveAttribute("aria-label", "breadcrumb");
  await expect(breadcrumb.locator('[aria-current="page"]')).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(breadcrumb.locator('li[aria-hidden="true"]')).toHaveCount(2);

  await openElementArtifact(page, "calendar");
  const calendar = page.locator("[ng-calendar]");
  await expect(calendar.locator(":scope > div button[value]")).toHaveCount(42);
  await calendar.locator('[value="2026-05-20"]').click();
  await expect(calendar).toHaveAttribute("data-value", "2026-05-20");

  await openElementArtifact(page, "chart");
  const chart = page.locator(".chart");
  expect(await chart.getAttribute("role")).toBeNull();
  await expect(chart).toHaveRole("figure");
  const bars = chart.locator(":scope > section > ul > li > span");
  await expect(bars).toHaveCount(12);
  await expect(bars.first()).toHaveAttribute("data-value", "61%");
});

test("card artifact exposes its authored anatomy", async ({ page }) => {
  await openElementArtifact(page, "card");
  const card = page.locator(".card");
  await expect(card.locator(":scope > header")).toHaveCount(1);
  await expect(card.locator(":scope > section")).toHaveCount(1);
  await expect(card.locator(":scope > footer")).toHaveCount(1);
  await expect(card.locator(":scope > header > menu")).toHaveCount(1);
  await expect(
    page.getByRole("heading", { name: "Login to your account" }),
  ).toBeVisible();
});
