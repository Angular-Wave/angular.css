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
  await expect(page.locator("[ng-alert]")).toHaveCount(2);
  await expect(page.locator("[ng-alert]").first()).toHaveAttribute(
    "role",
    "alert",
  );
  await expect(page.locator("[ng-alert]").first()).toHaveAttribute(
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
  const ratio = page.locator("[ng-aspect-ratio]");
  await expect(ratio).toHaveAttribute("ratio", "16 / 9");
  await expect(ratio).toHaveCSS("--ratio", "16 / 9");
  await expect(ratio.getByRole("img", { name: "Photo" })).toBeVisible();

  await openElementArtifact(page, "avatar");
  const avatars = page.locator("[ng-avatar]");
  await expect(avatars).toHaveCount(5);
  await expect(avatars.first()).toHaveAttribute("data-state", "loaded");
  await expect(page.locator('[data-slot="avatar-group-count"]')).toHaveText(
    "+3",
  );

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
  const breadcrumb = page.locator("[ng-breadcrumb]");
  await expect(breadcrumb).toHaveAttribute("aria-label", "breadcrumb");
  await expect(
    breadcrumb.locator('[data-slot="breadcrumb-page"]'),
  ).toHaveAttribute("aria-current", "page");
  await expect(
    breadcrumb.locator('[data-slot="breadcrumb-separator"]'),
  ).toHaveCount(2);

  await openElementArtifact(page, "calendar");
  const calendar = page.locator("[ng-calendar]");
  await expect(
    calendar.locator(':is([data-slot="calendar-day"], [ng-calendar-day])'),
  ).toHaveCount(42);
  await calendar.locator('[data-value="2026-05-20"]').click();
  await expect(calendar).toHaveAttribute("data-value", "2026-05-20");

  await openElementArtifact(page, "chart");
  const chart = page.locator("[ng-chart]");
  await expect(chart).toHaveAttribute("role", "img");
  await expect(chart.locator('[data-slot="chart-bar"]')).toHaveCount(12);
  await expect(
    chart.locator('[data-slot="chart-bar"]').first(),
  ).toHaveAttribute("data-value", "61%");
});

test("card artifact exposes its authored anatomy", async ({ page }) => {
  await openElementArtifact(page, "card");
  const card = page.locator("[ng-card]");
  await expect(card.locator('[data-slot="card-header"]')).toHaveCount(1);
  await expect(card.locator('[data-slot="card-content"]')).toHaveCount(1);
  await expect(card.locator('[data-slot="card-footer"]')).toHaveCount(1);
  await expect(card.locator('[data-slot="card-action"]')).toHaveCount(1);
  await expect(
    page.getByRole("heading", { name: "Login to your account" }),
  ).toBeVisible();
});
