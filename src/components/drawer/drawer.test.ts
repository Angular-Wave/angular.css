import { expect, test, type Locator, type Page } from "@playwright/test";

const canonicalUrl = "/docs/static/examples/components/drawer.html";
const dialogUrl = "/docs/static/examples/components/drawer-dialog.html";
const sidesUrl = "/docs/static/examples/components/drawer-sides.html";
const scrollUrl = "/docs/static/examples/components/drawer-scrollable.html";
const rtlUrl = "/docs/static/examples/components/drawer-rtl.html";

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

const waitForMotion = async (element: Locator): Promise<void> => {
  await element.evaluate(async (node) => {
    await Promise.allSettled(
      node.getAnimations().map((animation) => animation.finished),
    );
  });
};

test("canonical drawer is a native bottom modal with focus restoration", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  await expectBuiltArtifactRuntime(page);
  const root = page.locator("#goal-drawer");
  const trigger = root.locator(":scope > button:first-child");
  const content = root.locator("dialog");

  await expect(content).toBeHidden();
  await trigger.click();
  await expect(content).toHaveAttribute("open", "");
  await expect(content).toHaveAttribute("side", "bottom");
  expect(await content.evaluate((dialog) => dialog.matches(":modal"))).toBe(
    true,
  );
  await expect(root.getByRole("button", { name: "Decrease" })).toBeFocused();
  expect(
    await content.evaluate(
      (element) => getComputedStyle(element, "::before").display,
    ),
  ).toBe("block");

  await root.getByRole("button", { name: "Cancel" }).click();
  await expect(content).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("AngularTS owns goal state and declarative submit closes the drawer", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  const root = page.locator("#goal-drawer");
  await root.locator(":scope > button:first-child").click();
  await root.getByRole("button", { name: "Increase" }).click();
  await expect(root.locator("dialog menu > output > strong")).toHaveText("360");
  await root.getByRole("button", { name: "Submit" }).click();
  await expect(root.locator("dialog")).toBeHidden();
  await expect(page.locator(".drawer-output")).toContainText(
    "Submitted goal: 360",
  );
});

test("four authored sides anchor to their physical viewport edges", async ({
  page,
}) => {
  await page.setViewportSize({ height: 620, width: 900 });
  await page.goto(sidesUrl);
  await expectBuiltArtifactRuntime(page);
  const expected = ["top", "right", "bottom", "left"];
  const roots = page.locator(".drawer");
  await expect(roots).toHaveCount(4);

  for (let index = 0; index < expected.length; index += 1) {
    const side = expected[index];
    const root = roots.nth(index);
    const content = root.locator("dialog");
    await root.locator(":scope > button:first-child").click();
    await expect(content).toHaveAttribute("side", side);
    await waitForMotion(content);
    const box = await content.boundingBox();
    if (side === "top") expect(box!.y).toBeCloseTo(0, 0);
    if (side === "bottom") expect(box!.y + box!.height).toBeCloseTo(620, 0);
    if (side === "left") expect(box!.x).toBeCloseTo(0, 0);
    if (side === "right") expect(box!.x + box!.width).toBeCloseTo(900, 0);
    await root.getByRole("button", { name: "Cancel" }).click();
  }
});

test("right drawer body scrolls while its footer remains fixed", async ({
  page,
}) => {
  await page.setViewportSize({ height: 560, width: 900 });
  await page.goto(scrollUrl);
  const root = page.locator("#scrollable-drawer");
  await root.locator(":scope > button:first-child").click();
  const body = root.locator(":scope > dialog > section");
  const footer = root.locator("footer");
  expect(
    await body.evaluate(
      (element) => element.scrollHeight > element.clientHeight,
    ),
  ).toBe(true);
  const before = await footer.boundingBox();
  await body.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });
  const after = await footer.boundingBox();
  expect(after?.y).toBeCloseTo(before?.y ?? 0, 0);
});

test("responsive composition uses native dialogs on desktop and mobile", async ({
  page,
}) => {
  await page.setViewportSize({ height: 620, width: 900 });
  await page.goto(dialogUrl);
  const desktop = page.locator(".drawer-dialog-desktop");
  const mobile = page.locator(".drawer-dialog-mobile");
  await expect(desktop).toBeVisible();
  await expect(mobile).toBeHidden();
  await desktop.getByRole("button", { name: "Edit Profile" }).click();
  await expect(desktop.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");

  await page.setViewportSize({ height: 700, width: 390 });
  await page.reload();
  await expect(desktop).toBeHidden();
  await expect(mobile).toBeVisible();
  await mobile.getByRole("button", { name: "Edit Profile" }).click();
  await expect(mobile.getByRole("dialog")).toBeVisible();
  await expect(page.locator("#mobile-email")).toBeFocused();
});

test("RTL drawer inherits direction and keeps AngularTS goal interaction", async ({
  page,
}) => {
  await page.goto(rtlUrl);
  const root = page.locator("#rtl-goal-drawer");
  await root.locator(":scope > button:first-child").click();
  await expect(root.locator("dialog")).toHaveCSS("direction", "rtl");
  await root.getByRole("button", { name: "زيادة" }).click();
  await expect(root.locator("dialog menu > output > strong")).toHaveText("360");
  await root.getByRole("button", { name: "إلغاء" }).click();
  await expect(root.locator("dialog")).toBeHidden();
});
