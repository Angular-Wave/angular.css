import { expect, test, type Page } from "@playwright/test";

const canonicalUrl = "/src/components/context-menu/context-menu.html";
const workflowsUrl =
  "/docs/static/examples/components/context-menu-workflows.html";
const sidesUrl = "/docs/static/examples/components/context-menu-sides.html";
const rtlUrl = "/docs/static/examples/components/context-menu-rtl.html";

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

test("canonical artifact opens only as a context menu and skips disabled items", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  await expectBuiltArtifactRuntime(page);
  const root = page.locator("#context-menu-demo");
  const trigger = root.locator(":scope > :first-child");
  const content = root.locator(":scope > menu");

  await expect(trigger).toHaveAttribute("aria-haspopup", "menu");
  await expect(trigger).toHaveAttribute("role", "button");
  await expect(content).toHaveAttribute("role", "menu");
  await expect(content).toBeHidden();

  await trigger.click();
  await expect(content).toBeHidden();

  await trigger.click({ button: "right", position: { x: 160, y: 40 } });
  await expect(content).toBeVisible();
  await expect(root).toHaveAttribute("open", "");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(content.getByRole("menuitem", { name: /^Back/ })).toBeFocused();

  await page.keyboard.press("ArrowDown");
  await expect(
    content.getByRole("menuitem", { name: /^Reload/ }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(content).toBeHidden();
  await expect(page.locator(".context-menu-output")).toContainText(
    "Last action: Reload",
  );
});

test("keyboard opening, submenu direction, escape, and external state compose", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  const root = page.locator("#context-menu-demo");
  const trigger = root.locator(":scope > :first-child");
  const content = root.locator(":scope > menu");
  const subTrigger = root.locator("details > summary");
  const subContent = root.locator("details > menu");

  await trigger.focus();
  await trigger.press("Shift+F10");
  await expect(content).toBeVisible();
  await subTrigger.focus();
  await subTrigger.press("ArrowRight");
  await expect(subContent).toBeVisible();
  await expect(
    subContent.getByRole("menuitem", { name: "Save Page..." }),
  ).toBeFocused();
  await page.keyboard.press("ArrowLeft");
  await expect(subContent).toBeHidden();
  await expect(subTrigger).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(content).toBeHidden();
  await expect(trigger).toBeFocused();

  await root.evaluate((element) => element.setAttribute("open", ""));
  await expect(content).toBeVisible();
  await root.evaluate((element) => element.removeAttribute("open"));
  await expect(content).toBeHidden();
});

test("workflow artifact preserves groups, shortcuts, icons, and destructive styling", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  await expectBuiltArtifactRuntime(page);
  const icons = page
    .getByRole("heading", { name: "Icons and destructive action" })
    .locator("..");
  const groups = page
    .getByRole("heading", { name: "Groups and shortcuts" })
    .locator("..");

  await icons.locator("[ng-context-menu] > :first-child").click({
    button: "right",
  });
  const deleteItem = icons.getByRole("menuitem", { name: "Delete" });
  await expect(deleteItem.locator("svg")).toHaveCount(1);
  await expect(deleteItem).toHaveAttribute("variant", "destructive");
  await deleteItem.click();
  await expect(icons.locator("output")).toContainText("Action: Delete");

  await groups.locator("[ng-context-menu] > :first-child").click({
    button: "right",
  });
  await expect(
    groups.locator("[ng-context-menu] > menu > section"),
  ).toHaveCount(2);
  await expect(
    groups.locator("[ng-context-menu] > menu > section").first(),
  ).toHaveAttribute("role", "group");
  await expect(
    groups.locator("[ng-context-menu] > menu > section > h3"),
  ).toHaveText(["File", "Edit"]);
  await expect(groups.locator("kbd")).toHaveCount(5);
  await expect(groups.getByRole("menuitem", { name: /Redo/ })).toBeDisabled();
});

test("AngularTS owns checkbox and radio values while the menu reflects semantics", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  const checkbox = page
    .getByRole("heading", { name: "Checkboxes" })
    .locator("..");
  const radio = page
    .getByRole("heading", { name: "Radio groups" })
    .locator("..");

  await checkbox.locator("[ng-context-menu] > :first-child").click({
    button: "right",
  });
  const bookmarks = checkbox.getByRole("menuitemcheckbox", {
    name: "Show Bookmarks Bar",
  });
  await expect(bookmarks).toHaveAttribute("aria-checked", "true");
  await bookmarks.click();
  await expect(checkbox.locator("output")).toContainText("Bookmarks: Off");

  await radio.locator("[ng-context-menu] > :first-child").click({
    button: "right",
  });
  const colm = radio.getByRole("menuitemradio", { name: "Colm Tuite" });
  await expect(colm).toHaveAttribute("aria-checked", "false");
  await colm.click();
  await expect(radio.locator("output")).toContainText("Person: colm");
  await radio.locator("[ng-context-menu] > :first-child").click({
    button: "right",
  });
  await expect(
    radio.getByRole("menuitemradio", { name: "Colm Tuite" }),
  ).toHaveAttribute("aria-checked", "true");
});

test("all six authored sides position a visible menu within the viewport", async ({
  page,
}) => {
  await page.setViewportSize({ height: 760, width: 900 });
  await page.goto(sidesUrl);
  const roots = page.locator("[ng-context-menu]");
  await expect(roots).toHaveCount(6);
  const expectedSides = [
    "inline-start",
    "left",
    "top",
    "bottom",
    "right",
    "inline-end",
  ];

  for (let index = 0; index < expectedSides.length; index += 1) {
    const root = roots.nth(index);
    const content = root.locator(":scope > menu");
    await root.locator(":scope > :first-child").click({ button: "right" });
    await expect(content).toBeVisible();
    await expect(content).toHaveAttribute("side", expectedSides[index]);
    const box = await content.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(900);
    expect(box!.y + box!.height).toBeLessThanOrEqual(760);
    await page.keyboard.press("Escape");
  }
});

test("RTL artifact mirrors logical content and submenu keyboard direction", async ({
  page,
}) => {
  await page.goto(rtlUrl);
  const root = page.locator("[ng-context-menu]");
  const trigger = root.locator(":scope > :first-child");
  const content = root.locator(":scope > menu");
  const subTrigger = root.locator("details > summary");
  const subContent = root.locator("details > menu");

  await expect(root).toHaveCSS("direction", "rtl");
  await trigger.click({ button: "right" });
  await expect(content).toHaveCSS("direction", "rtl");
  const firstItem = content.getByRole("menuitem", { name: /رجوع/ });
  const shortcut = firstItem.locator("kbd");
  const itemBox = await firstItem.boundingBox();
  const shortcutBox = await shortcut.boundingBox();
  expect(itemBox).not.toBeNull();
  expect(shortcutBox).not.toBeNull();
  expect(shortcutBox!.x).toBeLessThan(itemBox!.x + itemBox!.width / 2);

  await subTrigger.focus();
  await subTrigger.press("ArrowLeft");
  await expect(subContent).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(subContent).toBeHidden();
  await expect(subTrigger).toBeFocused();
});
