import { expect, test, type Page } from "@playwright/test";

const canonicalUrl = "/docs/static/examples/components/dialog.html";
const closeWorkflowsUrl =
  "/docs/static/examples/components/dialog-close-workflows.html";
const scrollWorkflowsUrl =
  "/docs/static/examples/components/dialog-scroll-workflows.html";
const rtlUrl = "/docs/static/examples/components/dialog-rtl.html";

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

test("canonical dialog uses native modal behavior and invoker commands", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  await expectBuiltArtifactRuntime(page);
  const root = page.locator("#profile-dialog");
  const trigger = root.locator(".dialog-trigger");
  const content = root.locator("dialog");

  await expect(content).toBeHidden();
  await expect(trigger).toHaveAttribute("command", "show-modal");
  await expect(trigger).toHaveAttribute("commandfor", "profile-dialog-content");
  await trigger.click();
  await expect(content).toBeVisible();
  await expect(content).toHaveAttribute("open", "");
  expect(await content.evaluate((dialog) => dialog.matches(":modal"))).toBe(
    true,
  );
  await expect(page.locator("#dialog-name")).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(content).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("native dialog exposes focusable close controls and restores the trigger", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  const root = page.locator("#profile-dialog");
  const trigger = root.locator(".dialog-trigger");
  const content = root.locator("dialog");

  await trigger.click();
  await root.locator(".dialog-close").focus();
  await expect(root.locator(".dialog-close")).toBeFocused();
  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(content).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("AngularTS form state remains authoritative inside native dialog", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  const root = page.locator("#profile-dialog");
  await root.locator(".dialog-trigger").click();
  await page.locator("#dialog-name").fill("Jane Doe");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(root.locator("dialog")).toBeHidden();
  await expect(page.locator(".dialog-output")).toContainText(
    "Saved profile: Jane Doe",
  );
});

test("close workflows distinguish corner and footer actions", async ({
  page,
}) => {
  await page.goto(closeWorkflowsUrl);
  await expectBuiltArtifactRuntime(page);
  const share = page.locator("#share-dialog");
  const plain = page.locator("#plain-dialog");

  await share.locator(".dialog-trigger").click();
  await expect(share.locator(".dialog-close")).toHaveCount(1);
  await share
    .getByRole("button", { name: "Close", exact: true })
    .first()
    .click();
  await expect(share.locator("dialog")).toBeHidden();

  await plain.locator(".dialog-trigger").click();
  await expect(plain.locator(".dialog-close")).toHaveCount(0);
  await plain.getByRole("button", { name: "Continue" }).click();
  await expect(plain.locator("dialog")).toBeHidden();
});

test("scroll workflows provide real overflow and stationary footers", async ({
  page,
}) => {
  await page.setViewportSize({ height: 520, width: 900 });
  await page.goto(scrollWorkflowsUrl);
  await expectBuiltArtifactRuntime(page);

  const scrollDialog = page.locator("#scroll-dialog");
  await scrollDialog.locator(".dialog-trigger").click();
  const body = scrollDialog.locator(".dialog-body");
  expect(
    await body.evaluate(
      (element) => element.scrollHeight > element.clientHeight,
    ),
  ).toBe(true);
  await page.keyboard.press("Escape");

  const stickyDialog = page.locator("#sticky-dialog");
  await stickyDialog.locator(".dialog-trigger").click();
  const stickyBody = stickyDialog.locator(".dialog-body");
  const footer = stickyDialog.locator(".dialog-footer");
  const before = await footer.boundingBox();
  await stickyBody.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });
  const after = await footer.boundingBox();
  expect(
    await stickyBody.evaluate((element) => element.scrollTop),
  ).toBeGreaterThan(0);
  expect(after?.y).toBeCloseTo(before?.y ?? 0, 0);
});

test("RTL dialog inherits direction and mirrors logical close placement", async ({
  page,
}) => {
  await page.goto(rtlUrl);
  await expectBuiltArtifactRuntime(page);
  const root = page.locator("#rtl-profile-dialog");
  await root.locator(".dialog-trigger").click();
  const content = root.locator("dialog");
  const close = root.locator(".dialog-close");
  await expect(content).toHaveCSS("direction", "rtl");
  const contentBox = await content.boundingBox();
  const closeBox = await close.boundingBox();
  expect(closeBox!.x).toBeLessThan(contentBox!.x + contentBox!.width / 2);
  await page.getByRole("button", { name: "إلغاء" }).click();
  await expect(content).toBeHidden();
});
