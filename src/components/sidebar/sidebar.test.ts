import { expect, test, type Page } from "@playwright/test";

const canonicalUrl = "/docs/static/examples/components/sidebar.html";
const anatomyUrl = "/docs/static/examples/components/sidebar-anatomy.html";
const collapsibleUrl =
  "/docs/static/examples/components/sidebar-collapsible.html";
const rtlUrl = "/docs/static/examples/components/sidebar-rtl.html";

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

test("canonical artifact reflects options and AngularTS controlled state", async ({
  page,
}) => {
  await page.setViewportSize({ height: 700, width: 900 });
  await page.goto(canonicalUrl);
  await expectBuiltArtifactRuntime(page);

  const sidebar = page.locator("#app-sidebar");
  const layout = page.locator(".sidebar-layout");
  const trigger = page.getByRole("button", { name: "Close Sidebar" });
  await expect(sidebar).toHaveAttribute("data-collapsible", "icon");
  await expect(sidebar).toHaveAttribute("data-side", "left");
  await expect(sidebar).toHaveAttribute("data-variant", "sidebar");
  await expect(sidebar).toHaveAttribute("data-state", "expanded");
  await expect(sidebar).toHaveAttribute("data-mobile", "false");
  expect(await sidebar.getAttribute("role")).toBeNull();
  await expect(sidebar).toHaveAttribute("aria-hidden", "false");
  await expect(trigger).toHaveAttribute("aria-controls", "app-sidebar");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(sidebar.locator("[data-active='true']")).toHaveAttribute(
    "aria-current",
    "page",
  );
  const [layoutBox, fullHeightBox] = await Promise.all([
    layout.boundingBox(),
    sidebar.boundingBox(),
  ]);
  expect(layoutBox?.height).toBeCloseTo(700, 0);
  expect(fullHeightBox?.height).toBeCloseTo(700, 0);
  await expect(sidebar).toHaveCSS("transition-duration", "0.2s, 0.2s, 0.2s");

  await page.getByRole("textbox", { name: "Filter navigation" }).fill("sales");
  await expect(page.locator(".sidebar-query-output")).toContainText(
    "Filter: sales",
  );

  const expandedBox = await sidebar.boundingBox();
  await trigger.click();
  await expect(sidebar).toHaveAttribute("data-state", "collapsed");
  await expect(sidebar).toHaveAttribute("aria-hidden", "false");
  await expect(sidebar).toHaveAttribute("data-open", "false");
  await expect(
    page.getByRole("button", { name: "Open Sidebar" }),
  ).toHaveAttribute("aria-expanded", "false");
  expect(expandedBox?.width).toBeCloseTo(256, 0);
  await page.waitForTimeout(80);
  const transitioningBox = await sidebar.boundingBox();
  expect(transitioningBox?.width).toBeGreaterThan(48);
  expect(transitioningBox?.width).toBeLessThan(256);
  await expect
    .poll(async () => (await sidebar.boundingBox())?.width)
    .toBeCloseTo(48, 0);
  const collapsedBox = await sidebar.boundingBox();
  expect(collapsedBox?.width).toBeCloseTo(48, 0);
  await expect(sidebar.getByText("Models", { exact: true })).toBeHidden();
  await expect(sidebar.locator(".sidebar-brand-mark")).toBeVisible();
  const sidebarCenter = collapsedBox!.x + collapsedBox!.width / 2;
  const centeredItems = sidebar.locator(
    ".sidebar-brand-mark, .sidebar-menu-button > svg, .sidebar-menu-button > [ng-avatar]",
  );
  const centeredItemCount = await centeredItems.count();
  expect(centeredItemCount).toBeGreaterThan(0);
  for (let index = 0; index < centeredItemCount; index += 1) {
    const box = await centeredItems.nth(index).boundingBox();
    expect(box).not.toBeNull();
    expect(
      Math.abs(box!.x + box!.width / 2 - sidebarCenter),
    ).toBeLessThanOrEqual(1);
  }

  await page.keyboard.press("Control+b");
  await expect(sidebar).toHaveAttribute("data-state", "expanded");
});

test("anatomy artifact wires groups, actions, menus, badges, and loading state", async ({
  page,
}) => {
  await page.setViewportSize({ height: 800, width: 900 });
  await page.goto(anatomyUrl);
  await expectBuiltArtifactRuntime(page);

  const groups = page.locator(".sidebar-group");
  await expect(groups).toHaveCount(3);
  for (let index = 0; index < 3; index += 1) {
    await expect(groups.nth(index)).toHaveAttribute(
      "aria-labelledby",
      /sidebar-group-label-/,
    );
  }
  await expect(page.locator(".sidebar-group-action")).toHaveCount(2);
  await expect(page.locator(".sidebar-group-action").first()).toHaveAttribute(
    "type",
    "button",
  );
  await expect(page.locator(".sidebar-menu-action")).toHaveAttribute(
    "type",
    "button",
  );
  await expect(page.locator(".sidebar-menu-badge")).toHaveCount(2);
  expect(
    await page
      .locator(".sidebar-menu-skeleton")
      .first()
      .evaluate(
        (element) => getComputedStyle(element, "::after").animationName,
      ),
  ).toContain("angularcss-sidebar-skeleton");

  await page.getByRole("button", { name: "Add Project" }).click();
  await expect(page.locator(".sidebar-anatomy-output")).toHaveText(
    "Added project",
  );
  await page.getByRole("button", { name: "Toggle loading" }).click();
  await expect(page.locator(".sidebar-menu-skeleton")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Support" })).toBeVisible();

  await page
    .getByRole("button", { name: "More actions for Design Engineering" })
    .click();
  await page.getByRole("menuitem", { name: "Edit Project" }).click();
  await expect(page.locator(".sidebar-anatomy-output")).toHaveText(
    "Edited Design Engineering",
  );
});

test("collapsible artifact composes existing disclosure behavior", async ({
  page,
}) => {
  await page.goto(collapsibleUrl);
  await expectBuiltArtifactRuntime(page);

  const help = page.getByRole("button", { name: "Help" });
  const gettingStarted = page.getByRole("button", {
    name: "Getting Started",
  });
  const build = page.getByRole("button", { name: "Build Your Application" });
  await expect(help).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("link", { name: "Support" })).toBeVisible();
  await help.click();
  await expect(help).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByRole("link", { name: "Support" })).toBeHidden();

  await expect(gettingStarted).toHaveAttribute("aria-expanded", "true");
  await expect(build).toHaveAttribute("aria-expanded", "false");
  await build.click();
  await expect(build).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("link", { name: "Data Fetching" })).toBeVisible();
});

test("RTL artifact anchors right and preserves usable icon collapse", async ({
  page,
}) => {
  await page.setViewportSize({ height: 700, width: 900 });
  await page.goto(rtlUrl);
  await expectBuiltArtifactRuntime(page);

  const sidebar = page.locator("#rtl-sidebar");
  await expect(sidebar).toHaveAttribute("data-direction", "rtl");
  await expect(sidebar).toHaveAttribute("data-side", "right");
  await expect(sidebar).toHaveAttribute("data-variant", "floating");
  const expandedBox = await sidebar.boundingBox();
  expect(expandedBox).not.toBeNull();
  expect(expandedBox!.x).toBeCloseTo(604, 0);
  expect(expandedBox!.x + expandedBox!.width).toBeCloseTo(892, 0);

  await page.getByRole("button", { name: "إغلاق الشريط" }).click();
  await expect(sidebar).toHaveAttribute("data-state", "collapsed");
  await expect(sidebar).toHaveAttribute("aria-hidden", "false");
  await expect
    .poll(async () => (await sidebar.boundingBox())?.width)
    .toBeCloseTo(56, 0);
  const collapsedBox = await sidebar.boundingBox();
  expect(collapsedBox).not.toBeNull();
  expect(collapsedBox!.width).toBeCloseTo(56, 0);
  expect(collapsedBox!.x + collapsedBox!.width).toBeCloseTo(892, 0);

  await page.getByRole("button", { name: "فتح الشريط" }).click();
  await page.getByRole("button", { name: "المزيد" }).click();
  await page.getByRole("menuitem", { name: "عرض المشروع" }).click();
  await expect(page.locator(".sidebar-anatomy-output")).toHaveText(
    "عرض المشروع",
  );
});

test("canonical artifact mirrors responsive state", async ({ page }) => {
  await page.setViewportSize({ height: 700, width: 640 });
  await page.goto(canonicalUrl);
  await expect(page.locator("#app-sidebar")).toHaveAttribute(
    "data-mobile",
    "true",
  );
  await page.setViewportSize({ height: 700, width: 1024 });
  await expect(page.locator("#app-sidebar")).toHaveAttribute(
    "data-mobile",
    "false",
  );
});
