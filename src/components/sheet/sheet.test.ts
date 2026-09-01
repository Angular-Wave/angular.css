import { expect, test, type Page } from "@playwright/test";

const canonicalUrl = "/docs/static/examples/components/sheet.html";
const noCloseUrl = "/docs/static/examples/components/sheet-no-close.html";
const sidesUrl = "/docs/static/examples/components/sheet-sides.html";
const rtlUrl = "/docs/static/examples/components/sheet-rtl.html";

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

test("canonical sheet uses native modal focus and AngularTS profile state", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  await expectBuiltArtifactRuntime(page);
  const root = page.locator("#profile-sheet");
  const trigger = root.locator(".sheet-trigger");
  const content = root.locator("dialog");
  const name = page.locator("#sheet-demo-name");

  await expect(content).toBeHidden();
  await trigger.click();
  await expect(content).toHaveAttribute("open", "");
  await expect(content).toHaveAttribute("data-side", "right");
  expect(await content.evaluate((dialog) => dialog.matches(":modal"))).toBe(
    true,
  );
  await expect(name).toBeFocused();

  await name.fill("Jane Doe");
  await root.getByRole("button", { name: "Save changes" }).click();
  await expect(content).toBeHidden();
  await expect(page.locator(".sheet-output")).toContainText(
    "Saved profile: Jane Doe",
  );
  await expect(trigger).toBeFocused();
});

test("canonical sheet supports Escape and focus restoration", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  const root = page.locator("#profile-sheet");
  const trigger = root.locator(".sheet-trigger");
  await trigger.click();
  await page.keyboard.press("Escape");
  await expect(root.locator("dialog")).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("no-close sheet relies on native Escape and light dismissal", async ({
  page,
}) => {
  await page.goto(noCloseUrl);
  await expectBuiltArtifactRuntime(page);
  const root = page.locator("#plain-sheet");
  const trigger = root.locator(".sheet-trigger");
  const content = root.locator("dialog");

  await expect(root.locator("[command='close']")).toHaveCount(0);
  await trigger.click();
  await expect(content).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(content).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("all authored sides anchor physically and retain real overflow", async ({
  page,
}) => {
  await page.setViewportSize({ height: 620, width: 900 });
  await page.goto(sidesUrl);
  await expectBuiltArtifactRuntime(page);
  const sides = ["top", "right", "bottom", "left"];
  const roots = page.locator(".sheet");
  await expect(roots).toHaveCount(4);

  for (let index = 0; index < sides.length; index += 1) {
    const side = sides[index];
    const root = roots.nth(index);
    const content = root.locator("dialog");
    const body = root.locator(".sheet-body");
    const footer = root.locator(".sheet-footer");
    await root.locator(".sheet-trigger").click();
    await expect(content).toHaveAttribute("data-side", side);
    const box = await content.boundingBox();
    if (side === "top") expect(box!.y).toBeCloseTo(0, 0);
    if (side === "bottom") expect(box!.y + box!.height).toBeCloseTo(620, 0);
    if (side === "left") expect(box!.x).toBeCloseTo(0, 0);
    if (side === "right") expect(box!.x + box!.width).toBeCloseTo(900, 0);
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
    await root.getByRole("button", { name: "Cancel" }).click();
  }
});

test("RTL sheet inherits content direction on the physical left edge", async ({
  page,
}) => {
  await page.setViewportSize({ height: 620, width: 900 });
  await page.goto(rtlUrl);
  const root = page.locator("#rtl-profile-sheet");
  await root.locator(".sheet-trigger").click();
  const content = root.locator("dialog");
  await expect(content).toHaveCSS("direction", "rtl");
  await expect(content).toHaveAttribute("data-side", "left");
  const box = await content.boundingBox();
  expect(box!.x).toBeCloseTo(0, 0);
  await page.locator("#sheet-rtl-name").fill("ليلى منصور");
  await root.getByRole("button", { name: "حفظ التغييرات" }).click();
  await expect(content).toBeHidden();
  await expect(page.locator(".sheet-output")).toContainText("ليلى منصور");
});
