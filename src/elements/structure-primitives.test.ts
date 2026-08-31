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

test("empty, item, keyboard, and separator artifacts expose semantic structure", async ({
  page,
}) => {
  await openElementArtifact(page, "empty");
  const empty = page.locator("[ng-empty]");
  await expect(empty).toHaveAttribute("role", "status");
  await expect(empty).toHaveAttribute("aria-live", "polite");
  await expect(
    empty.getByRole("heading", { name: "No Projects Yet" }),
  ).toBeVisible();

  await openElementArtifact(page, "item");
  await expect(page.locator("#outline-item")).toHaveAttribute(
    "data-variant",
    "outline",
  );
  await expect(page.locator("#disabled-item")).toHaveAttribute(
    "aria-disabled",
    "true",
  );

  await openElementArtifact(page, "kbd");
  await expect(page.locator("[ng-kbd]").first()).toHaveAttribute(
    "aria-label",
    "Keyboard shortcut Ctrl",
  );
  await expect(page.locator("[ng-kbd]").nth(2)).toHaveAttribute(
    "aria-label",
    "Slash",
  );

  await openElementArtifact(page, "separator");
  await expect(page.locator("[ng-separator]").first()).toHaveAttribute(
    "aria-orientation",
    "horizontal",
  );
  await expect(
    page.locator('[ng-separator][orientation="vertical"]'),
  ).toHaveCount(4);
  await expect(
    page.locator('[ng-separator][orientation="vertical"]').first(),
  ).toHaveAttribute("role", "separator");
});

test("field and label artifacts connect controls, descriptions, errors, and AngularTS values", async ({
  page,
}) => {
  await openElementArtifact(page, "field");
  const name = page.getByLabel("Name");
  const email = page.getByLabel("Email");
  await expect(name).toHaveAttribute("aria-describedby", /field-message-/);
  await expect(email).toHaveAttribute("aria-describedby", /field-message-/);
  await expect(email).toHaveAttribute("aria-invalid", "true");
  await name.fill("Ada Lovelace");
  await email.fill("ada@example.com");
  await expect(page.locator(".output")).toContainText("Ada Lovelace");
  await expect(page.locator(".output")).toContainText("ada@example.com");
  await expect(page.getByText("Enter a valid email.")).toHaveCount(0);

  await openElementArtifact(page, "label");
  await expect(page.locator('label[for="email"]')).toHaveAttribute(
    "data-associated",
    "true",
  );
  await expect(page.locator('label[for="name"]')).toHaveAttribute(
    "data-disabled",
    "false",
  );
});

test("input-group artifact associates its visible addon with the control", async ({
  page,
}) => {
  await openElementArtifact(page, "input-group");
  const group = page.locator("[ng-input-group]");
  const input = page.getByLabel("Search");
  await expect(group).toHaveAttribute("data-has-addon", "true");
  await expect(group).toHaveAttribute("data-addon-count", "1");
  await expect(group).toHaveAttribute("data-has-button", "false");
  const addonId = await group
    .locator('[data-slot="input-group-addon"]')
    .getAttribute("id");
  await expect(input).toHaveAttribute("aria-describedby", addonId ?? "");
});

test("navigation and pagination artifacts preserve native navigation semantics", async ({
  page,
}) => {
  await openElementArtifact(page, "navigation-menu");
  const menu = page.locator("[ng-navigation-menu]");
  const gettingStarted = menu.getByRole("button", {
    name: "Getting started",
  });
  await expect(gettingStarted).toHaveAttribute("aria-expanded", "false");
  await gettingStarted.click();
  await expect(gettingStarted).toHaveAttribute("aria-expanded", "true");
  await expect(menu.getByRole("link", { name: /Introduction/ })).toBeVisible();
  await gettingStarted.press("ArrowRight");
  await expect(menu.getByRole("button", { name: "Components" })).toBeFocused();

  await openElementArtifact(page, "pagination");
  const pagination = page.getByRole("navigation", { name: "pagination" });
  await expect(pagination.getByRole("link", { name: "2" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(
    pagination.getByRole("link", { name: "Go to previous page" }),
  ).toHaveAttribute("href", "#previous");
});

test("scroll-area artifact exposes both overflow axes and synchronized scroll state", async ({
  page,
}) => {
  await openElementArtifact(page, "scroll-area");
  const root = page.locator("[ng-scroll-area]");
  const viewport = page.locator("[ng-scroll-area-viewport]");
  await expect(viewport).toHaveAttribute("tabindex", "0");
  await expect(viewport).toHaveAttribute("role", "region");
  await expect(viewport).toHaveAttribute("aria-label", "Scrollable content");
  await expect(root).toHaveAttribute("data-scrollable-x", "true");
  await expect(root).toHaveAttribute("data-scrollable-y", "true");
  await viewport.evaluate((element) => {
    element.scrollTop = 12;
    element.scrollLeft = 18;
    element.dispatchEvent(new Event("scroll"));
  });
  await expect(root).toHaveAttribute("data-scroll-top", "12");
  await expect(root).toHaveAttribute("data-scroll-left", "18");
});
