import { expect, test } from "@playwright/test";

const workflowsUrl =
  "/docs/static/examples/components/scroll-area-workflows.html";

test("published scroll area exposes focusable viewport and live scroll state", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  const root = page.locator("#vertical-scroll-area");
  const viewport = root.locator("[ng-scroll-area-viewport]");

  await expect(viewport).toHaveAttribute("tabindex", "0");
  await expect(viewport).toHaveAttribute("role", "region");
  await expect(viewport).toHaveAttribute("aria-label", "Release tags");
  await expect(root).toHaveAttribute("data-scrollable-y", "true");
  await expect(root).toHaveAttribute("data-scroll-at-top", "true");

  await viewport.hover();
  await page.mouse.wheel(0, 160);
  await expect
    .poll(async () => Number((await root.getAttribute("data-scroll-top")) || 0))
    .toBeGreaterThan(0);
  await expect(root).toHaveAttribute("data-scroll-at-top", "false");
});

test("published horizontal scrollbar tracks and changes viewport position", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  const root = page.locator("#horizontal-scroll-area");
  const scrollbar = root.locator(
    '[data-slot="scroll-area-scrollbar"][data-orientation="horizontal"]',
  );
  const thumb = scrollbar.locator('[data-slot="scroll-area-thumb"]');

  await expect(root).toHaveAttribute("data-scrollable-x", "true");
  await expect(scrollbar).toHaveAttribute("data-visible", "true");
  await expect(thumb).toHaveAttribute("aria-hidden", "true");
  await expect(thumb).toHaveAttribute("data-size", /\d+/);

  const box = await scrollbar.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box!.x + 8, box!.y + box!.height / 2);
  await page.mouse.down();
  await page.mouse.move(box!.x + box!.width - 8, box!.y + box!.height / 2);
  await page.mouse.up();
  await expect
    .poll(async () =>
      Math.abs(Number((await root.getAttribute("data-scroll-left")) || 0)),
    )
    .toBeGreaterThan(0);
  await expect(thumb).toHaveAttribute("data-offset", /[1-9]\d*/);
});

test("published workflow updates overflow when AngularTS inserts content", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  const root = page.locator("#dynamic-scroll-area");

  await expect(root).toHaveAttribute("data-scrollable-y", "false");
  await page.getByRole("button", { name: "Add content" }).click();
  await expect(root).toHaveAttribute("data-scrollable-y", "true");
  await expect(
    root.locator('[data-slot="scroll-area-scrollbar"]'),
  ).toHaveAttribute("data-visible", "true");
});

test("published workflow mirrors AngularTS direction and scroll boundaries", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  const rtl = page.locator("#rtl-scroll-area");
  const rtlViewport = rtl.locator("[ng-scroll-area-viewport]");
  await expect(rtl).toHaveAttribute("data-direction", "rtl");
  await expect(rtlViewport).toHaveAttribute("data-direction", "rtl");

  await page.getByRole("button", { name: "Change direction" }).click();
  await expect(rtl).toHaveAttribute("data-direction", "ltr");
  await expect(rtlViewport).toHaveAttribute("data-direction", "ltr");

  const vertical = page.locator("#vertical-scroll-area");
  const viewport = vertical.locator("[ng-scroll-area-viewport]");
  await viewport.focus();
  await viewport.press("End");
  await expect(vertical).toHaveAttribute("data-scroll-at-bottom", "true");
});
