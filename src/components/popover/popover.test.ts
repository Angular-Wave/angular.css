import { expect, test, type Locator, type Page } from "@playwright/test";

const canonicalUrl = "/docs/static/examples/components/popover.html";
const workflowsUrl = "/docs/static/examples/components/popover-workflows.html";
const rtlUrl = "/docs/static/examples/components/popover-rtl.html";

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

const expectPhysicalSide = async (
  trigger: Locator,
  content: Locator,
  side: "bottom" | "left" | "right" | "top",
): Promise<void> => {
  const triggerBox = await trigger.boundingBox();
  const contentBox = await content.boundingBox();
  expect(triggerBox).not.toBeNull();
  expect(contentBox).not.toBeNull();

  if (side === "left") {
    expect(contentBox!.x + contentBox!.width).toBeLessThanOrEqual(
      triggerBox!.x,
    );
  } else if (side === "right") {
    expect(contentBox!.x).toBeGreaterThanOrEqual(
      triggerBox!.x + triggerBox!.width,
    );
  } else if (side === "top") {
    expect(contentBox!.y + contentBox!.height).toBeLessThanOrEqual(
      triggerBox!.y,
    );
  } else {
    expect(contentBox!.y).toBeGreaterThanOrEqual(
      triggerBox!.y + triggerBox!.height,
    );
  }
};

test("canonical popover uses built bundles and exposes disclosure semantics", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  await expectBuiltArtifactRuntime(page);

  const root = page.locator("[ng-popover]");
  const trigger = page.locator("[ng-popover-trigger]");
  const content = page.locator("[ng-popover-content]");

  await expect(content).toBeHidden();
  await expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toHaveAttribute(
    "aria-controls",
    (await content.getAttribute("id")) ?? "",
  );
  await expect(content).toHaveAttribute("role", "dialog");
  await expect(content).toHaveAttribute("aria-modal", "false");
  await expect(content).toHaveAttribute("data-side", "bottom");
  await expect(content).toHaveAttribute("data-align", "center");

  await trigger.click();
  await expect(root).toHaveAttribute("data-state", "open");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(content).toBeVisible();
  await expect(content).toHaveAttribute("aria-hidden", "false");
  await expect(page.locator("#popover-width")).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(content).toBeHidden();
  await expect(content).toHaveAttribute("data-state", "closed");
  await expect(trigger).toBeFocused();
});

test("native trigger keyboard activation and external open state remain functional", async ({
  page,
}) => {
  await page.goto(canonicalUrl);

  const root = page.locator("[ng-popover]");
  const trigger = page.locator("[ng-popover-trigger]");
  const content = page.locator("[ng-popover-content]");

  await trigger.focus();
  await trigger.press("Enter");
  await expect(content).toBeVisible();
  await page.keyboard.press("Escape");

  await root.evaluate((element) => element.setAttribute("data-open", "true"));
  await expect(content).toBeVisible();
  await expect(root).toHaveAttribute("data-state", "open");

  await content.evaluate((element) =>
    element.setAttribute("data-open", "false"),
  );
  await expect(content).toBeHidden();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});

test("workflow alignments render start, center, and end geometry", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  await expectBuiltArtifactRuntime(page);

  for (const align of ["start", "center", "end"] as const) {
    const trigger = page.getByRole("button", {
      name: new RegExp(`^${align}$`, "i"),
    });
    const content = trigger.locator("..").locator("[ng-popover-content]");
    await trigger.click();
    await expect(content).toBeVisible();
    await expect(content).toHaveAttribute("data-align", align);

    const triggerBox = await trigger.boundingBox();
    const contentBox = await content.boundingBox();
    expect(triggerBox).not.toBeNull();
    expect(contentBox).not.toBeNull();
    if (align === "start") {
      expect(Math.abs(contentBox!.x - triggerBox!.x)).toBeLessThanOrEqual(1);
    } else if (align === "center") {
      const triggerCenter = triggerBox!.x + triggerBox!.width / 2;
      const contentCenter = contentBox!.x + contentBox!.width / 2;
      expect(Math.abs(contentCenter - triggerCenter)).toBeLessThanOrEqual(1);
    } else {
      const triggerEnd = triggerBox!.x + triggerBox!.width;
      const contentEnd = contentBox!.x + contentBox!.width;
      expect(Math.abs(contentEnd - triggerEnd)).toBeLessThanOrEqual(1);
    }
    await page.keyboard.press("Escape");
  }
});

test("form focus can move within content and focus outside dismisses", async ({
  page,
}) => {
  await page.goto(workflowsUrl);

  const trigger = page.getByRole("button", { name: "Edit dimensions" });
  const content = trigger.locator("..").locator("[ng-popover-content]");
  const width = content.getByRole("textbox", { name: "Width" });
  const height = content.getByRole("textbox", { name: "Height" });

  await trigger.click();
  await expect(width).toBeFocused();
  await height.focus();
  await expect(content).toBeVisible();

  await page.getByRole("button", { name: "Start", exact: true }).focus();
  await expect(content).toBeHidden();
});

test("disabled and sibling workflow states dismiss without stealing focus", async ({
  page,
}) => {
  await page.goto(workflowsUrl);

  const disabled = page.getByRole("button", { name: "Disabled" });
  const disabledContent = disabled
    .locator("..")
    .locator("[ng-popover-content]");
  await disabled.click({ force: true });
  await expect(disabledContent).toBeHidden();
  await expect(disabled).toHaveAttribute("aria-expanded", "false");

  const first = page.getByRole("button", { name: "First", exact: true });
  const second = page.getByRole("button", { name: "Second", exact: true });
  const firstContent = first.locator("..").locator("[ng-popover-content]");
  const secondContent = second.locator("..").locator("[ng-popover-content]");
  await first.click();
  await expect(firstContent).toBeVisible();
  await second.click();
  await expect(firstContent).toBeHidden();
  await expect(secondContent).toBeVisible();
  await expect(secondContent).toBeFocused();
});

test("RTL preserves direction while every side remains physical", async ({
  page,
}) => {
  await page.goto(rtlUrl);

  for (const [name, side] of [
    ["يسار", "left"],
    ["أعلى", "top"],
    ["أسفل", "bottom"],
    ["يمين", "right"],
  ] as const) {
    const trigger = page.getByRole("button", { name });
    const root = trigger.locator("..");
    const content = root.locator("[ng-popover-content]");
    await expect(root).toHaveAttribute("data-direction", "rtl");
    await trigger.click();
    await expect(content).toHaveAttribute("data-direction", "rtl");
    await expect(content).toHaveAttribute("data-side", side);
    await expectPhysicalSide(trigger, content, side);
    await page.keyboard.press("Escape");
  }
});
