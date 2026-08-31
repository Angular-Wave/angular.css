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

test("canonical artifact supplies modal semantics, focus containment, and profile state", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  await expectBuiltArtifactRuntime(page);
  const root = page.locator("#profile-sheet");
  const trigger = root.locator("[ng-sheet-trigger]");
  const content = root.locator("[ng-sheet-content]");
  const name = page.locator("#sheet-demo-name");

  await expect(root).not.toHaveAttribute("data-slot");
  await expect(root).toHaveAttribute("data-side", "right");
  await expect(content).toBeHidden();
  await trigger.click();
  await expect(content).toBeVisible();
  await expect(content).toHaveAttribute("data-side", "right");
  await expect(content).toHaveAttribute("role", "dialog");
  await expect(content).toHaveAttribute("aria-modal", "true");
  await expect(content).toHaveAttribute(
    "aria-labelledby",
    /profile-sheet-title/,
  );
  await expect(content).toHaveAttribute(
    "aria-describedby",
    /profile-sheet-description/,
  );
  await expect(name).toBeFocused();
  await expect(page.locator(".sheet-output")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
  expect(
    await page.locator("html").evaluate((element) => element.style.overflow),
  ).toBe("hidden");

  await page.keyboard.press("Shift+Tab");
  await expect(root.getByRole("button", { name: "Close sheet" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(name).toBeFocused();

  await name.fill("Jane Doe");
  await root.getByRole("button", { name: "Save changes" }).click();
  await expect(content).toBeHidden();
  await expect(page.locator(".sheet-output")).toContainText(
    "Saved profile: Jane Doe",
  );
  await expect(trigger).toBeFocused();
  expect(
    await page.locator("html").evaluate((element) => element.style.overflow),
  ).toBe("");
});

test("canonical artifact supports Escape and controlled data-open state", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  const root = page.locator("#profile-sheet");
  const trigger = root.locator("[ng-sheet-trigger]");
  const content = root.locator("[ng-sheet-content]");

  await trigger.click();
  await page.keyboard.press("Escape");
  await expect(content).toBeHidden();
  await expect(trigger).toBeFocused();

  await root.evaluate((element) => element.setAttribute("data-open", "true"));
  await expect(content).toBeVisible();
  await root.evaluate((element) => element.setAttribute("data-open", "false"));
  await expect(content).toBeHidden();
});

test("no-close artifact omits controls and closes only through modal behavior", async ({
  page,
}) => {
  await page.goto(noCloseUrl);
  await expectBuiltArtifactRuntime(page);
  const root = page.locator("#plain-sheet");
  const trigger = root.locator("[ng-sheet-trigger]");
  const content = root.locator("[ng-sheet-content]");

  await expect(
    root.locator("[ng-sheet-close], [data-sheet-close]"),
  ).toHaveCount(0);
  await trigger.click();
  await expect(content).toBeVisible();
  await expect(content).toBeFocused();
  await root.locator("[ng-sheet-overlay]").dispatchEvent("click");
  await expect(content).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("all authored sides reflect state, anchor physically, and provide real overflow", async ({
  page,
}) => {
  await page.setViewportSize({ height: 620, width: 900 });
  await page.goto(sidesUrl);
  await expectBuiltArtifactRuntime(page);
  const sides = ["top", "right", "bottom", "left"];
  const roots = page.locator("[ng-sheet]");
  await expect(roots).toHaveCount(4);

  for (let index = 0; index < sides.length; index += 1) {
    const side = sides[index];
    const root = roots.nth(index);
    const content = root.locator("[ng-sheet-content]");
    const body = root.locator("[ng-sheet-body]");
    const footer = root.locator("[ng-sheet-footer]");
    await expect(root).toHaveAttribute("data-side", side);
    await root.locator("[ng-sheet-trigger]").click();
    const box = await content.boundingBox();
    expect(box).not.toBeNull();
    if (side === "top") expect(box!.y).toBeCloseTo(0, 0);
    if (side === "bottom") expect(box!.y + box!.height).toBeCloseTo(620, 0);
    if (side === "left") expect(box!.x).toBeCloseTo(0, 0);
    if (side === "right") expect(box!.x + box!.width).toBeCloseTo(900, 0);
    if (side === "top" || side === "bottom") {
      expect(box!.height).toBeLessThanOrEqual(311);
    }
    expect(
      await body.evaluate(
        (element) => element.scrollHeight > element.clientHeight,
      ),
    ).toBe(true);
    const footerBefore = await footer.boundingBox();
    await body.evaluate((element) => {
      element.scrollTop = element.scrollHeight;
    });
    expect(await body.evaluate((element) => element.scrollTop)).toBeGreaterThan(
      0,
    );
    const footerAfter = await footer.boundingBox();
    expect(footerAfter?.y).toBeCloseTo(footerBefore?.y ?? 0, 0);
    await root.getByRole("button", { name: "Cancel" }).click();
  }
});

test("RTL artifact keeps logical content direction on a physical left sheet", async ({
  page,
}) => {
  await page.setViewportSize({ height: 620, width: 900 });
  await page.goto(rtlUrl);
  await expectBuiltArtifactRuntime(page);
  const root = page.locator("#rtl-profile-sheet");
  const content = root.locator("[ng-sheet-content]");

  await expect(root).toHaveAttribute("data-direction", "rtl");
  await expect(root).toHaveAttribute("data-side", "left");
  await root.locator("[ng-sheet-trigger]").click();
  await expect(content).toHaveAttribute("data-direction", "rtl");
  await expect(content).toHaveAttribute("data-side", "left");
  const box = await content.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeCloseTo(0, 0);
  await page.locator("#sheet-rtl-name").fill("ليلى منصور");
  await root.getByRole("button", { name: "حفظ التغييرات" }).click();
  await expect(content).toBeHidden();
  await expect(page.locator(".sheet-output")).toContainText("ليلى منصور");
});
