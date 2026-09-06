import { expect, test, type Locator } from "@playwright/test";

const canonicalUrl = "/src/components/hover-card/hover-card.html";
const workflowsUrl =
  "/docs/static/examples/components/hover-card-workflows.html";
const rtlUrl = "/docs/static/examples/components/hover-card-rtl.html";

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

test("canonical hover card opens from focus and restores semantic closed state", async ({
  page,
}) => {
  await page.goto(canonicalUrl);

  const trigger = page.locator("[ng-hover-card] > :is(a, button)");
  const content = page.locator("[ng-hover-card] > aside");
  await expect(content).toBeHidden();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  expect(await content.getAttribute("role")).toBeNull();
  await expect(content).toHaveAttribute("aria-hidden", "true");

  await trigger.focus();
  await expect(content).toBeVisible();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(content).toHaveAttribute("aria-hidden", "false");

  await trigger.blur();
  await expect(content).toBeHidden();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});

test("pointer can cross from trigger into content before delayed close", async ({
  page,
}) => {
  await page.goto(canonicalUrl);

  const trigger = page.locator("[ng-hover-card] > :is(a, button)");
  const content = page.locator("[ng-hover-card] > aside");
  await trigger.hover();
  await expect(content).toBeVisible();
  await content.hover();
  await page.waitForTimeout(150);
  await expect(content).toBeVisible();

  await page.mouse.move(4, 4);
  await expect(content).toBeHidden();
});

test("canonical hover card synchronizes its concise open state", async ({
  page,
}) => {
  await page.goto(canonicalUrl);

  const root = page.locator("[ng-hover-card]");
  const trigger = page.locator("[ng-hover-card] > :is(a, button)");
  const content = page.locator("[ng-hover-card] > aside");
  await root.evaluate((element) => element.setAttribute("open", ""));
  await expect(content).toBeVisible();
  await expect(root).toHaveAttribute("open", "");

  await root.evaluate((element) => element.removeAttribute("open"));
  await expect(content).toBeHidden();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(root).not.toHaveAttribute("open");
});

test("workflow sides use physical placement and disabled triggers stay closed", async ({
  page,
}) => {
  await page.goto(workflowsUrl);

  for (const side of ["left", "top", "bottom", "right"] as const) {
    const trigger = page.getByRole("button", {
      name: new RegExp(`^${side}$`, "i"),
    });
    const content = trigger.locator("..").locator(":scope > aside");
    await trigger.hover();
    await expect(content).toBeVisible();
    await expect(content).toHaveAttribute("side", side);
    await expectPhysicalSide(trigger, content, side);
    await page.mouse.move(4, 4);
    await expect(content).toBeHidden();
  }

  const disabled = page.getByRole("button", { name: "Disabled" });
  const disabledContent = disabled.locator("..").locator(":scope > aside");
  await disabled.hover({ force: true });
  await page.waitForTimeout(50);
  await expect(disabledContent).toBeHidden();
});

test("RTL workflow preserves direction while left and right remain physical", async ({
  page,
}) => {
  await page.goto(rtlUrl);

  for (const [name, side] of [
    ["يسار", "left"],
    ["يمين", "right"],
  ] as const) {
    const trigger = page.getByRole("button", { name });
    const root = trigger.locator("..");
    const content = root.locator(":scope > aside");
    await expect(root).toHaveCSS("direction", "rtl");
    await trigger.hover();
    await expect(content).toBeVisible();
    await expect(content).toHaveCSS("direction", "rtl");
    await expectPhysicalSide(trigger, content, side);
    await page.mouse.move(4, 4);
    await expect(content).toBeHidden();
  }
});

test("Escape closes an open hover card and restores trigger focus", async ({
  page,
}) => {
  await page.goto(canonicalUrl);

  const trigger = page.locator("[ng-hover-card] > :is(a, button)");
  const content = page.locator("[ng-hover-card] > aside");
  await trigger.focus();
  await expect(content).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(content).toBeHidden();
  await expect(trigger).toBeFocused();
});
