import { expect, test, type Locator, type Page } from "@playwright/test";

const canonicalUrl = "/docs/static/examples/components/resizable.html";
const workflowsUrl =
  "/docs/static/examples/components/resizable-workflows.html";
const statesUrl =
  "/docs/static/examples/components/resizable-state-workflows.html";

const groupPanels = (group: Locator): Locator =>
  group.locator(":scope > .resizable-panel");

const groupHandles = (group: Locator): Locator =>
  group.locator(":scope > .resizable-handle");

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

test("canonical nested layout supplies exact panel, handle, and ARIA anatomy", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  await expectBuiltArtifactRuntime(page);

  const groups = page.locator("[ng-resizable-panel-group]");
  const outer = groups.first();
  const inner = groups.nth(1);
  const outerHandle = groupHandles(outer);
  const innerHandle = groupHandles(inner);
  await expect(groups).toHaveCount(2);
  await expect(groupPanels(outer)).toHaveCount(2);
  await expect(groupPanels(inner)).toHaveCount(2);
  await expect(outerHandle).toHaveAttribute("role", "separator");
  await expect(outerHandle).toHaveAttribute("tabindex", "0");
  await expect(outerHandle).toHaveAttribute("aria-orientation", "vertical");
  await expect(innerHandle).toHaveAttribute("aria-orientation", "horizontal");
  await expect(outerHandle).toHaveAttribute("aria-valuenow", "1");
  await expect(outerHandle).toHaveAttribute("aria-valuemin", "0.25");
  await expect(outerHandle).toHaveAttribute("aria-valuemax", "4");

  const controlledIds = (
    await outerHandle.getAttribute("aria-controls")
  )?.split(/\s+/);
  expect(controlledIds).toHaveLength(2);
  await expect(groupPanels(outer).nth(0)).toHaveAttribute(
    "id",
    controlledIds?.[0] ?? "",
  );
  await expect(groupPanels(outer).nth(1)).toHaveAttribute(
    "id",
    controlledIds?.[1] ?? "",
  );

  const outerGrip = outerHandle.locator(".resizable-handle-grip");
  const innerGrip = innerHandle.locator(".resizable-handle-grip");
  expect((await outerGrip.boundingBox())?.width).toBe(4);
  expect((await outerGrip.boundingBox())?.height).toBe(24);
  expect((await innerGrip.boundingBox())?.width).toBe(24);
  expect((await innerGrip.boundingBox())?.height).toBe(4);
});

test("nested groups keep keyboard resizing scoped to direct panels", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  const groups = page.locator("[ng-resizable-panel-group]");
  const outer = groups.first();
  const inner = groups.nth(1);
  const outerHandle = groupHandles(outer);
  const innerHandle = groupHandles(inner);

  await outerHandle.press("ArrowRight");
  await expect(groupPanels(outer).first()).toHaveCSS("--panel-size", "1.25");
  await expect(groupPanels(inner).first()).toHaveCSS("--panel-size", "1");
  await expect(outerHandle).toHaveAttribute("aria-valuenow", "1.25");

  await innerHandle.press("ArrowDown");
  await expect(groupPanels(inner).first()).toHaveCSS("--panel-size", "1.25");
  await expect(innerHandle).toHaveAttribute("aria-valuenow", "1.25");
});

test("canonical handle resizes adjacent panels by pointer", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  const outer = page.locator("[ng-resizable-panel-group]").first();
  const handle = groupHandles(outer);
  const box = await handle.boundingBox();
  expect(box).not.toBeNull();

  const startX = box!.x + box!.width / 2;
  const startY = box!.y + box!.height / 2;
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + 48, startY);
  await expect(handle).toHaveAttribute("data-resizing", "true");
  await expect(groupPanels(outer).first()).toHaveCSS("--panel-size", /1\.[12]/);
  await page.mouse.up();

  await expect(handle).not.toHaveAttribute("data-resizing", "true");
  await expect(outer).not.toHaveAttribute("data-resizing", "true");
});

test("handle and vertical references preserve sizing, bounds, and grip variants", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  await expectBuiltArtifactRuntime(page);

  const handleLayout = page.locator("#handle-layout");
  const visibleHandle = groupHandles(handleLayout);
  await expect(groupPanels(handleLayout).nth(0)).toHaveCSS("--panel-size", "1");
  await expect(groupPanels(handleLayout).nth(1)).toHaveCSS("--panel-size", "3");
  await expect(visibleHandle.locator(".resizable-handle-grip")).toHaveCount(1);
  await visibleHandle.press("ArrowRight");
  await expect(groupPanels(handleLayout).nth(0)).toHaveCSS(
    "--panel-size",
    "1.25",
  );
  await expect(groupPanels(handleLayout).nth(1)).toHaveCSS(
    "--panel-size",
    "2.75",
  );

  const vertical = page.locator("#vertical-layout");
  const horizontalHandle = groupHandles(vertical);
  await expect(vertical).toHaveAttribute("data-orientation", "vertical");
  await expect(horizontalHandle).toHaveAttribute(
    "aria-orientation",
    "horizontal",
  );
  await expect(horizontalHandle.locator(".resizable-handle-grip")).toHaveCount(
    0,
  );
  await horizontalHandle.press("ArrowDown");
  await expect(groupPanels(vertical).first()).toHaveCSS("--panel-size", "1.5");
  await horizontalHandle.press("Home");
  await expect(groupPanels(vertical).first()).toHaveCSS("--panel-size", "0.5");
  await horizontalHandle.press("End");
  await expect(groupPanels(vertical).first()).toHaveCSS("--panel-size", "3.5");
});

test("RTL reference reverses horizontal resizing and preserves nested orientation", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  const rtl = page.locator("#rtl-layout");
  const outerHandle = groupHandles(rtl);
  const nested = rtl.locator(
    ":scope > .resizable-panel [ng-resizable-panel-group]",
  );
  const nestedHandle = groupHandles(nested);

  await expect(rtl).toHaveAttribute("dir", "rtl");
  await expect(rtl).toHaveAttribute("data-direction", "rtl");
  await expect(nested).toHaveAttribute("data-orientation", "vertical");
  await expect(nestedHandle).toHaveAttribute("aria-orientation", "horizontal");
  await outerHandle.press("ArrowRight");
  await expect(groupPanels(rtl).first()).toHaveCSS("--panel-size", "0.75");
  await expect(outerHandle).toHaveAttribute("aria-valuenow", "0.75");
});

test("state artifact synchronizes external size, orientation, and inserted panels", async ({
  page,
}) => {
  await page.goto(statesUrl);
  await expectBuiltArtifactRuntime(page);
  const group = page.locator("#state-layout");
  const firstHandle = page.locator("#state-first-handle");

  await page.getByRole("button", { name: "Set first size to 2" }).click();
  await expect(page.locator("#state-first-panel")).toHaveCSS(
    "--panel-size",
    "2",
  );
  await expect(firstHandle).toHaveAttribute("aria-valuenow", "2");

  await page.getByRole("button", { name: "Toggle orientation" }).click();
  await expect(group).toHaveAttribute("data-orientation", "vertical");
  await expect(firstHandle).toHaveAttribute("aria-orientation", "horizontal");

  await page.getByRole("button", { name: "Add third panel" }).click();
  const insertedHandle = page.locator("#state-inserted-handle");
  await expect(groupPanels(group)).toHaveCount(3);
  await expect(insertedHandle).toHaveAttribute("role", "separator");
  await expect(insertedHandle).toHaveAttribute("aria-controls", /\S+\s+\S+/);
  await insertedHandle.press("ArrowDown");
  await expect(groupPanels(group).nth(1)).toHaveCSS("--panel-size", "1.25");
  await expect(page.locator("#state-inserted-panel")).toHaveCSS(
    "--panel-size",
    "0.75",
  );
});

test("bounded state artifact exposes and enforces separator value limits", async ({
  page,
}) => {
  await page.goto(statesUrl);
  const group = page.locator("#bounded-layout");
  const handle = groupHandles(group);
  await expect(handle).toHaveAttribute("aria-valuemin", "0.5");
  await expect(handle).toHaveAttribute("aria-valuemax", "2");
  await handle.press("ArrowDown");
  await expect(groupPanels(group).first()).toHaveCSS("--panel-size", "1.5");
  await handle.press("ArrowDown");
  await expect(groupPanels(group).first()).toHaveCSS("--panel-size", "1.5");
  await handle.press("Home");
  await expect(groupPanels(group).first()).toHaveCSS("--panel-size", "0.5");
});
