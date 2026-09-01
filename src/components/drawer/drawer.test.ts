import { expect, test, type Page } from "@playwright/test";

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

test("canonical artifact supplies a modal bottom drawer and focus restoration", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  await expectBuiltArtifactRuntime(page);
  const root = page.locator("#goal-drawer");
  const trigger = root.locator(".drawer-trigger");
  const content = root.locator(".drawer-content");

  await expect(root).toHaveAttribute("data-side", "bottom");
  await expect(content).toBeHidden();
  await trigger.click();
  await expect(content).toBeVisible();
  await expect(content).toHaveAttribute("data-side", "bottom");
  expect(await content.getAttribute("role")).toBeNull();
  await expect(content).toHaveAttribute("aria-modal", "true");
  await expect(root.getByRole("button", { name: "Decrease" })).toBeFocused();
  await expect(root.locator(".drawer-handle")).toBeVisible();

  await root.getByRole("button", { name: "Cancel" }).click();
  await expect(content).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("AngularTS owns goal state while Drawer owns only disclosure", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  const root = page.locator("#goal-drawer");
  const content = root.locator(".drawer-content");
  await root.locator(".drawer-trigger").click();

  await root.getByRole("button", { name: "Increase" }).click();
  await expect(root.locator(".drawer-goal-value strong")).toHaveText("360");
  await root.getByRole("button", { name: "Submit" }).click();
  await expect(content).toBeVisible();
  await expect(page.locator(".drawer-output")).toContainText(
    "Submitted goal: 360",
  );

  await root.locator(".drawer-overlay").dispatchEvent("click");
  await expect(content).toBeHidden();
  await root.evaluate((element) => element.setAttribute("data-open", "true"));
  await expect(content).toBeVisible();
  await root.evaluate((element) => element.setAttribute("data-open", "false"));
  await expect(content).toBeHidden();
});

test("four authored sides reflect state and anchor to the correct viewport edge", async ({
  page,
}) => {
  await page.setViewportSize({ height: 620, width: 900 });
  await page.goto(sidesUrl);
  await expectBuiltArtifactRuntime(page);
  const expected = ["top", "right", "bottom", "left"];
  const roots = page.locator("[ng-drawer]");
  await expect(roots).toHaveCount(4);

  for (let index = 0; index < expected.length; index += 1) {
    const side = expected[index];
    const root = roots.nth(index);
    const content = root.locator(".drawer-content");
    await expect(root).toHaveAttribute("data-side", side);
    await root.locator(".drawer-trigger").click();
    const box = await content.boundingBox();
    expect(box).not.toBeNull();
    if (side === "top") expect(box!.y).toBeCloseTo(0, 0);
    if (side === "bottom") expect(box!.y + box!.height).toBeCloseTo(620, 0);
    if (side === "left") expect(box!.x).toBeCloseTo(0, 0);
    if (side === "right") expect(box!.x + box!.width).toBeCloseTo(900, 0);
    await expect(root.locator(".drawer-handle")).toHaveCount(
      side === "bottom" ? 1 : 0,
    );
    await root.getByRole("button", { name: "Cancel" }).click();
  }
});

test("right drawer body genuinely scrolls while its footer remains fixed", async ({
  page,
}) => {
  await page.setViewportSize({ height: 560, width: 900 });
  await page.goto(scrollUrl);
  await expectBuiltArtifactRuntime(page);
  const root = page.locator("#scrollable-drawer");
  await root.locator(".drawer-trigger").click();
  const body = root.locator(".drawer-body");
  const footer = root.locator(".drawer-footer");
  expect(
    await body.evaluate(
      (element) => element.scrollHeight > element.clientHeight,
    ),
  ).toBe(true);
  const before = await footer.boundingBox();
  await body.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });
  expect(await body.evaluate((element) => element.scrollTop)).toBeGreaterThan(
    0,
  );
  const after = await footer.boundingBox();
  expect(after?.y).toBeCloseTo(before?.y ?? 0, 0);
});

test("responsive composition uses Dialog on desktop and Drawer on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ height: 620, width: 900 });
  await page.goto(dialogUrl);
  await expectBuiltArtifactRuntime(page);
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

test("RTL artifact preserves logical layout and AngularTS goal interaction", async ({
  page,
}) => {
  await page.goto(rtlUrl);
  await expectBuiltArtifactRuntime(page);
  const root = page.locator("#rtl-goal-drawer");
  await expect(root).toHaveAttribute("data-direction", "rtl");
  await root.locator(".drawer-trigger").click();
  const content = root.locator(".drawer-content");
  await expect(content).toHaveAttribute("data-direction", "rtl");
  await root.getByRole("button", { name: "زيادة" }).click();
  await expect(root.locator(".drawer-goal-value strong")).toHaveText("360");
  await root.getByRole("button", { name: "إلغاء" }).click();
  await expect(content).toBeHidden();
});
