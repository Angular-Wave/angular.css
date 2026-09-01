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
  const empty = page.locator(".empty");
  expect(await empty.getAttribute("role")).toBeNull();
  await expect(empty).toHaveAttribute("aria-live", "polite");
  await expect(
    empty.getByRole("heading", { name: "No Projects Yet" }),
  ).toBeVisible();

  await openElementArtifact(page, "item");
  await expect(page.locator("#outline-item")).toHaveAttribute(
    "variant",
    "outline",
  );
  await expect(page.locator("#disabled-item")).toHaveAttribute(
    "aria-disabled",
    "true",
  );

  await openElementArtifact(page, "kbd");
  await expect(page.locator(".kbd").first()).toHaveText("Ctrl");
  await expect(page.locator(".kbd").nth(2)).toHaveAccessibleName("Slash");

  await openElementArtifact(page, "separator");
  await expect(page.locator(".separator").first()).toHaveAttribute(
    "aria-orientation",
    "horizontal",
  );
  await expect(page.locator('.separator[orientation="vertical"]')).toHaveCount(
    4,
  );
  const verticalSeparator = page
    .locator('.separator[orientation="vertical"]')
    .first();
  expect(await verticalSeparator.getAttribute("role")).toBeNull();
  await expect(verticalSeparator).toHaveRole("separator");
});

test("field and label artifacts connect controls, descriptions, errors, and AngularTS values", async ({
  page,
}) => {
  await openElementArtifact(page, "field");
  const name = page.getByLabel("Name");
  const email = page.getByLabel("Email");
  await expect(name).toHaveAttribute(
    "aria-describedby",
    "demo-profile-name-description",
  );
  await expect(email).toHaveAttribute(
    "aria-describedby",
    "demo-profile-email-error",
  );
  expect(
    await email.evaluate((control: HTMLInputElement) =>
      control.checkValidity(),
    ),
  ).toBe(false);
  await name.fill("Ada Lovelace");
  await email.fill("ada@example.com");
  await expect(page.locator(".output")).toContainText("Ada Lovelace");
  await expect(page.locator(".output")).toContainText("ada@example.com");
  await expect(page.getByText("Enter a valid email.")).toBeHidden();

  await openElementArtifact(page, "label");
  const emailControl = page.locator("#email");
  await page.locator('label[for="email"]').click();
  await expect(emailControl).toBeFocused();
  await expect(page.locator("#name")).toBeEnabled();
});

test("input-group artifact associates its visible addon with the control", async ({
  page,
}) => {
  await openElementArtifact(page, "input-group");
  const group = page.locator(".input-group");
  const input = page.getByLabel("Search");
  await group.locator(".input-group-addon").click();
  await expect(input).toBeFocused();
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

test("scroll-area artifact exposes native overflow on both axes", async ({
  page,
}) => {
  await openElementArtifact(page, "scroll-area");
  const root = page.locator(".scroll-area");
  await expect(root).toHaveAttribute("tabindex", "0");
  await expect(root).toHaveAttribute("aria-label", "Release tags");
  expect(
    await root.evaluate((element) => element.scrollWidth > element.clientWidth),
  ).toBe(true);
  expect(
    await root.evaluate(
      (element) => element.scrollHeight > element.clientHeight,
    ),
  ).toBe(true);
  await root.evaluate((element) => {
    element.scrollTop = 12;
    element.scrollLeft = 18;
  });
  expect(await root.evaluate((element) => element.scrollTop)).toBe(12);
  expect(await root.evaluate((element) => element.scrollLeft)).toBe(18);
});
