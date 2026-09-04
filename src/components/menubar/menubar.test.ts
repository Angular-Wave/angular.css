import { expect, test, type Locator, type Page } from "@playwright/test";

const canonicalUrl = "/docs/static/examples/components/menubar.html";
const workflowsUrl = "/docs/static/examples/components/menubar-workflows.html";
const rtlUrl = "/docs/static/examples/components/menubar-rtl.html";

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

const directContent = (trigger: Locator): Locator =>
  trigger.locator("..").locator(":scope > menu");

test("canonical menubar uses built bundles and a roving trigger tab stop", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  await expectBuiltArtifactRuntime(page);

  const menubar = page.locator("[ng-menubar]");
  const triggers = menubar.locator(":scope > section > button");
  const contents = menubar.locator(":scope > section > menu");
  await expect(menubar).toHaveAttribute("role", "menubar");
  await expect(menubar).not.toHaveAttribute("open");
  await expect(triggers).toHaveCount(4);
  await expect(triggers.nth(0)).toHaveAttribute("tabindex", "0");
  for (let index = 1; index < 4; index += 1) {
    await expect(triggers.nth(index)).toHaveAttribute("tabindex", "-1");
  }
  for (const content of await contents.all()) {
    await expect(content).toBeHidden();
    await expect(content).toHaveAttribute("role", "menu");
    await expect(content).toHaveAttribute("aria-hidden", "true");
  }
  const fileId = await triggers.nth(0).getAttribute("id");
  expect(fileId).toBeTruthy();
  await expect(contents.nth(0)).toHaveAttribute("aria-labelledby", fileId!);
});

test("closed trigger navigation moves focus without opening a menu", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  const triggers = page.locator("[ng-menubar] > section > button");
  await triggers.nth(0).focus();
  await triggers.nth(0).press("ArrowRight");
  await expect(triggers.nth(1)).toBeFocused();
  await expect(directContent(triggers.nth(1))).toBeHidden();
  await triggers.nth(1).press("End");
  await expect(triggers.nth(3)).toBeFocused();
  await triggers.nth(3).press("Home");
  await expect(triggers.nth(0)).toBeFocused();
  await expect(page.locator("[ng-menubar]")).not.toHaveAttribute("open");
});

test("open menu navigation skips disabled items and restores trigger focus", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  const file = page.getByRole("menuitem", { name: "File", exact: true });
  const fileContent = directContent(file);
  const newTab = fileContent.getByRole("menuitem", { name: /New Tab/ });
  const newWindow = fileContent.getByRole("menuitem", {
    name: /New Window/,
    exact: true,
  });
  const incognito = fileContent.getByRole("menuitem", {
    name: "New Incognito Window",
  });
  const share = fileContent.getByRole("menuitem", { name: "Share" });
  await file.press("Enter");
  await expect(fileContent).toBeVisible();
  await expect(newTab).toBeFocused();
  await newTab.press("ArrowDown");
  await expect(newWindow).toBeFocused();
  await newWindow.press("ArrowDown");
  await expect(incognito).not.toBeFocused();
  await expect(share).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(fileContent).toBeHidden();
  await expect(file).toBeFocused();
});

test("horizontal movement switches an open menu and submenus own their arrow keys", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  const file = page.getByRole("menuitem", { name: "File", exact: true });
  const edit = page.getByRole("menuitem", { name: "Edit", exact: true });
  const fileContent = directContent(file);
  const editContent = directContent(edit);
  await file.press("Enter");
  await page.keyboard.press("ArrowRight");
  await expect(fileContent).toBeHidden();
  await expect(editContent).toBeVisible();
  await expect(
    editContent.getByRole("menuitem", { name: /Undo/ }),
  ).toBeFocused();

  await page.keyboard.press("Escape");
  await file.press("Enter");
  const share = fileContent.getByRole("menuitem", { name: "Share" });
  const subContent = share.locator("..").locator(":scope > menu");
  await share.focus();
  await share.press("ArrowRight");
  await expect(subContent).toBeVisible();
  await expect(
    subContent.getByRole("menuitem", { name: "Email link" }),
  ).toBeFocused();
  const shareBox = await share.boundingBox();
  const subContentBox = await subContent.boundingBox();
  expect(shareBox).not.toBeNull();
  expect(subContentBox).not.toBeNull();
  expect(subContentBox!.x).toBeGreaterThanOrEqual(
    shareBox!.x + shareBox!.width,
  );
  await page.keyboard.press("ArrowLeft");
  await expect(subContent).toBeHidden();
  await expect(share).toBeFocused();

  await fileContent.getByRole("menuitem", { name: /Print/ }).click();
  await expect(fileContent).toBeHidden();
  await expect(file).toHaveAttribute("aria-expanded", "false");
});

test("controlled open state and AngularTS-owned item state remain functional", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  const view = page.getByRole("menuitem", { name: "View", exact: true });
  const viewContent = directContent(view);
  await viewContent.evaluate((element) => element.setAttribute("open", ""));
  await expect(viewContent).toBeVisible();
  await expect(view).toHaveAttribute("aria-expanded", "true");
  const fullUrls = viewContent.getByRole("menuitemcheckbox", {
    includeHidden: true,
    name: "Full URLs",
  });
  await expect(fullUrls).toHaveAttribute("aria-checked", "true");
  await fullUrls.click();
  await expect(fullUrls).toHaveAttribute("aria-checked", "false");
  await expect(viewContent).toBeHidden();

  const profiles = page.getByRole("menuitem", {
    name: "Profiles",
    exact: true,
  });
  await profiles.click();
  const profilesContent = directContent(profiles);
  const luis = profilesContent.getByRole("menuitemradio", {
    includeHidden: true,
    name: "Luis",
  });
  const benoit = profilesContent.getByRole("menuitemradio", {
    includeHidden: true,
    name: "Benoit",
  });
  await expect(benoit).toHaveAttribute("aria-checked", "true");
  await luis.click();
  await expect(luis).toHaveAttribute("aria-checked", "true");
  await expect(benoit).toHaveAttribute("aria-checked", "false");
});

test("workflow artifact binds dynamically inserted menus and items in DOM order", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  await expectBuiltArtifactRuntime(page);
  await page.getByRole("button", { name: "Add View menu" }).click();
  await page.getByRole("button", { name: "Add Zoom item" }).click();
  const dynamicMenu = page.locator("#dynamic-view-menu");
  const dynamicView = dynamicMenu.locator(":scope > button");
  const dynamicZoom = page.locator("#dynamic-zoom-item");
  await expect(dynamicMenu).toBeVisible();
  await expect(dynamicView).toHaveAttribute("role", "menuitem");
  await expect(dynamicZoom).toHaveAttribute("role", "menuitem");

  const dynamicMenubar = page.getByRole("menubar", { name: "Dynamic menu" });
  const file = dynamicMenubar.getByRole("menuitem", {
    name: "File",
    exact: true,
  });
  const disabled = dynamicMenubar.getByRole("menuitem", {
    name: "Disabled",
    exact: true,
  });
  await file.focus();
  await file.press("ArrowRight");
  await expect(dynamicView).toBeFocused();
  await dynamicView.press("ArrowRight");
  await expect(file).toBeFocused();
  await expect(disabled).not.toBeFocused();
  await file.press("Enter");
  await expect(dynamicZoom).toBeVisible();
  await disabled.click({ force: true });
  await expect(directContent(disabled)).toBeHidden();
});

test("workflow variants expose checkbox, radio, icon, and submenu compositions", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  const preferences = page.getByRole("menubar", { name: "View preferences" });
  await preferences.getByRole("menuitem", { name: "View" }).click();
  const fullUrls = preferences.getByRole("menuitemcheckbox", {
    includeHidden: true,
    name: "Always Show Full URLs",
  });
  await expect(fullUrls).toHaveAttribute("aria-checked", "true");
  await fullUrls.click();
  await expect(fullUrls).toHaveAttribute("aria-checked", "false");

  const profiles = page.getByRole("menubar", { name: "Profile and theme" });
  await profiles.getByRole("menuitem", { name: "Profiles" }).click();
  const luis = profiles.getByRole("menuitemradio", {
    includeHidden: true,
    name: "Luis",
  });
  await luis.click();
  await expect(luis).toHaveAttribute("aria-checked", "true");

  const fileTools = page.getByRole("menubar", { name: "File tools" });
  await fileTools.getByRole("menuitem", { name: "File" }).click();
  await expect(fileTools.locator("menu button > svg")).toHaveCount(3);

  const commands = page.getByRole("menubar", { name: "Editing commands" });
  await commands.getByRole("menuitem", { name: "File" }).click();
  const share = commands.getByRole("menuitem", { name: "Share" });
  await share.focus();
  await share.press("ArrowRight");
  await expect(
    commands.getByRole("menuitem", { name: "Email link" }),
  ).toBeFocused();
});

test("RTL reverses top-level and submenu horizontal navigation", async ({
  page,
}) => {
  await page.goto(rtlUrl);
  await expectBuiltArtifactRuntime(page);
  const menubar = page.locator("[ng-menubar]");
  await expect(menubar).toHaveCSS("direction", "rtl");
  const file = page.getByRole("menuitem", { name: "ملف", exact: true });
  const edit = page.getByRole("menuitem", { name: "تعديل", exact: true });
  await edit.press("Enter");
  await page.keyboard.press("ArrowRight");
  await expect(directContent(file)).toBeVisible();
  const share = directContent(file).getByRole("menuitem", { name: "مشاركة" });
  await share.focus();
  await share.press("ArrowLeft");
  const subContent = share.locator("..").locator(":scope > menu");
  await expect(subContent).toBeVisible();
  const shareBox = await share.boundingBox();
  const subContentBox = await subContent.boundingBox();
  expect(shareBox).not.toBeNull();
  expect(subContentBox).not.toBeNull();
  expect(subContentBox!.x + subContentBox!.width).toBeLessThanOrEqual(
    shareBox!.x,
  );
});
