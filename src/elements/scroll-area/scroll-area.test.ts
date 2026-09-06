import { expect, test } from "@playwright/test";

const workflowsUrl =
  "/docs/static/examples/components/scroll-area-workflows.html";

test("canonical scroll area source uses native overflow", async ({ page }) => {
  await page.goto("/src/elements/scroll-area/scroll-area.html");

  const region = page.getByRole("region", { name: "Release tags" });
  await expect(region).toHaveAttribute("tabindex", "0");
  expect(
    await region.evaluate(
      (element) => element.scrollWidth > element.clientWidth,
    ),
  ).toBe(true);
});

test("published scroll area uses a focusable native overflow region", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  const region = page.locator("#vertical-scroll-area");

  await expect(region).toHaveAttribute("tabindex", "0");
  await expect(region).toHaveAttribute("aria-label", "Release tags");
  expect(
    await region.evaluate(
      (element) => element.scrollHeight > element.clientHeight,
    ),
  ).toBe(true);

  await region.hover();
  await page.mouse.wheel(0, 160);
  await expect
    .poll(async () => region.evaluate((element) => element.scrollTop))
    .toBeGreaterThan(0);
});

test("published horizontal area relies on native scrollbar behavior", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  const region = page.locator("#horizontal-scroll-area");

  expect(
    await region.evaluate(
      (element) => element.scrollWidth > element.clientWidth,
    ),
  ).toBe(true);
  await region.evaluate((element) => {
    element.scrollLeft = element.scrollWidth;
  });
  expect(
    await region.evaluate((element) => Math.abs(element.scrollLeft)),
  ).toBeGreaterThan(0);
});

test("AngularTS content naturally updates native overflow geometry", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  const region = page.locator("#dynamic-scroll-area");

  expect(
    await region.evaluate(
      (element) => element.scrollHeight > element.clientHeight,
    ),
  ).toBe(false);
  await page.getByRole("button", { name: "Add content" }).click();
  await expect
    .poll(() =>
      region.evaluate((element) => element.scrollHeight > element.clientHeight),
    )
    .toBe(true);
});

test("native scroll area preserves authored AngularTS direction", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  const rtl = page.locator("#rtl-scroll-area");

  await expect(rtl).toHaveAttribute("dir", "rtl");
  await page.getByRole("button", { name: "Change direction" }).click();
  await expect(rtl).toHaveAttribute("dir", "ltr");

  const vertical = page.locator("#vertical-scroll-area");
  await vertical.focus();
  await vertical.press("End");
  await expect
    .poll(async () => vertical.evaluate((element) => element.scrollTop))
    .toBeGreaterThan(0);
});
