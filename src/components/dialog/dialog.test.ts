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

test("canonical artifact supplies modal semantics and direct trigger ownership", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  await expectBuiltArtifactRuntime(page);
  const root = page.locator("#profile-dialog");
  const trigger = root.locator("[ng-dialog-trigger]");
  const content = root.locator("[ng-dialog-content]");
  const overlay = root.locator("[ng-dialog-overlay]");

  await expect(root).not.toHaveAttribute("data-slot");
  await expect(content).toBeHidden();
  await expect(trigger).toHaveAttribute("type", "button");
  await expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(content).toHaveAttribute("role", "dialog");
  await expect(content).toHaveAttribute("aria-modal", "true");
  await expect(content).toHaveAttribute("aria-hidden", "true");

  await trigger.click();
  await expect(content).toBeVisible();
  await expect(root).toHaveAttribute("data-state", "open");
  await expect(overlay).toHaveAttribute("data-state", "open");
  await expect(content).toHaveAttribute(
    "aria-labelledby",
    await root.locator("[ng-dialog-title]").getAttribute("id"),
  );
  await expect(content).toHaveAttribute(
    "aria-describedby",
    await root.locator("[ng-dialog-description]").getAttribute("id"),
  );
  await expect(page.locator("#dialog-name")).toBeFocused();
});

test("focus wraps, escaped focus is contained, and dismissal restores the trigger", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  const root = page.locator("#profile-dialog");
  const trigger = root.locator("[ng-dialog-trigger]");
  const content = root.locator("[ng-dialog-content]");
  const cornerClose = root.locator("[ng-dialog-close]");

  await trigger.click();
  await cornerClose.focus();
  await page.keyboard.press("Tab");
  await expect(page.locator("#dialog-name")).toBeFocused();

  await page
    .locator(".dialog-output")
    .evaluate((element) => (element as HTMLElement).focus());
  await expect(page.locator("#dialog-name")).toBeFocused();

  await root.locator(".dialog-overlay-probe").dispatchEvent("click");
  await expect(content).toBeVisible();
  await root.locator("[ng-dialog-overlay]").dispatchEvent("click");
  await expect(content).toBeHidden();
  await expect(trigger).toBeFocused();

  await trigger.click();
  await page.keyboard.press("Escape");
  await expect(content).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("open dialogs isolate the background and lock document scrolling", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  const trigger = page.locator("[ng-dialog-trigger]");
  const background = page.locator(".dialog-output");

  await trigger.click();
  await expect(background).toHaveAttribute("inert", "");
  await expect(background).toHaveAttribute("aria-hidden", "true");
  expect(
    await page.evaluate(() => ({
      body: document.body.style.overflow,
      html: document.documentElement.style.overflow,
    })),
  ).toEqual({ body: "hidden", html: "hidden" });

  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(background).not.toHaveAttribute("inert", "");
  await expect(background).not.toHaveAttribute("aria-hidden", "true");
  expect(
    await page.evaluate(() => ({
      body: document.body.style.overflow,
      html: document.documentElement.style.overflow,
    })),
  ).toEqual({ body: "", html: "" });
});

test("AngularTS form state remains authoritative and controlled state composes", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  const root = page.locator("#profile-dialog");
  const content = root.locator("[ng-dialog-content]");
  const trigger = root.locator("[ng-dialog-trigger]");

  await trigger.click();
  await page.locator("#dialog-name").fill("Jane Doe");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(content).toBeHidden();
  await expect(page.locator(".dialog-output")).toContainText(
    "Saved profile: Jane Doe",
  );

  await root.evaluate((element) => element.setAttribute("data-open", "true"));
  await expect(content).toBeVisible();
  await root.evaluate((element) => element.setAttribute("data-open", "false"));
  await expect(content).toBeHidden();
});

test("close-button workflows distinguish corner and footer close actions", async ({
  page,
}) => {
  await page.goto(closeWorkflowsUrl);
  await expectBuiltArtifactRuntime(page);
  const share = page.locator("#share-dialog");
  const plain = page.locator("#plain-dialog");

  await share.locator("[ng-dialog-trigger]").click();
  await expect(share.locator("[ng-dialog-close]")).toHaveCount(1);
  await expect(share.locator("[data-dialog-close]")).toHaveCount(1);
  await share.locator("[data-dialog-close]").click();
  await expect(share.locator("[ng-dialog-content]")).toBeHidden();

  await plain.locator("[ng-dialog-trigger]").click();
  await expect(plain.locator("[ng-dialog-close]")).toHaveCount(0);
  await expect(plain.getByRole("button", { name: "Continue" })).toBeVisible();
  await plain.getByRole("button", { name: "Continue" }).click();
  await expect(plain.locator("[ng-dialog-content]")).toBeHidden();
});

test("scroll workflows provide real overflow and keep the footer stationary", async ({
  page,
}) => {
  await page.setViewportSize({ height: 520, width: 900 });
  await page.goto(scrollWorkflowsUrl);
  await expectBuiltArtifactRuntime(page);

  const scrollDialog = page.locator("#scroll-dialog");
  await scrollDialog.locator("[ng-dialog-trigger]").click();
  const body = scrollDialog.locator("[ng-dialog-body]");
  expect(
    await body.evaluate(
      (element) => element.scrollHeight > element.clientHeight,
    ),
  ).toBe(true);
  await page.keyboard.press("Escape");

  const stickyDialog = page.locator("#sticky-dialog");
  await stickyDialog.locator("[ng-dialog-trigger]").click();
  const stickyBody = stickyDialog.locator("[ng-dialog-body]");
  const footer = stickyDialog.locator("[ng-dialog-footer]");
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

test("RTL artifact mirrors semantics and logical corner positioning", async ({
  page,
}) => {
  await page.goto(rtlUrl);
  await expectBuiltArtifactRuntime(page);
  const root = page.locator("[ng-dialog]");
  await expect(root).toHaveAttribute("data-direction", "rtl");
  await root.locator("[ng-dialog-trigger]").click();
  const content = root.locator("[ng-dialog-content]");
  const close = root.locator("[ng-dialog-close]");
  await expect(content).toHaveAttribute("data-direction", "rtl");
  const contentBox = await content.boundingBox();
  const closeBox = await close.boundingBox();
  expect(contentBox).not.toBeNull();
  expect(closeBox).not.toBeNull();
  expect(closeBox!.x).toBeLessThan(contentBox!.x + contentBox!.width / 2);
  await page.getByRole("button", { name: "إلغاء" }).click();
  await expect(content).toBeHidden();
});
