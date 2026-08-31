import { expect, test } from "@playwright/test";

const canonicalUrl = "/docs/static/examples/components/toggle-group.html";
const workflowsUrl =
  "/docs/static/examples/components/toggle-group-workflows.html";
const itemSelector =
  ':is([data-slot="toggle-group-item"], [ng-toggle-group-item])';

test("published toggle group enforces single selection and mirrors application state", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  const group = page.locator("[ng-toggle-group]");
  const items = group.locator(itemSelector);

  await expect(group).toHaveAttribute("role", "group");
  await expect(items.nth(1)).toHaveAttribute("data-state", "on");
  await expect(items.nth(1)).toHaveAttribute("tabindex", "0");
  await items.nth(0).click();
  await items.nth(2).click();
  await expect(items.nth(0)).toHaveAttribute("aria-pressed", "false");
  await expect(items.nth(1)).toHaveAttribute("aria-pressed", "false");
  await expect(items.nth(2)).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".output")).toContainText("Alignment: right");
});

test("published workflow supports independent multiple selection", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  const group = page.locator("#multiple-toggle-group");
  const items = group.locator(itemSelector);

  await expect(items.nth(0)).toHaveAttribute("data-state", "on");
  await expect(items.nth(1)).toHaveAttribute("data-state", "on");
  await items.nth(2).click();
  await items.nth(0).click();
  await expect(items.nth(0)).toHaveAttribute("aria-pressed", "false");
  await expect(items.nth(1)).toHaveAttribute("aria-pressed", "true");
  await expect(items.nth(2)).toHaveAttribute("aria-pressed", "true");
});

test("published workflow skips disabled items during arrow navigation", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  const group = page.locator("#keyboard-toggle-group");
  const items = group.locator(itemSelector);

  await items.nth(0).focus();
  await items.nth(0).press("ArrowRight");
  await expect(items.nth(2)).toBeFocused();
  await expect(items.nth(0)).toHaveAttribute("aria-pressed", "false");
  await expect(items.nth(1)).toHaveAttribute("data-disabled", "true");
  await expect(items.nth(2)).toHaveAttribute("aria-pressed", "true");
  await expect(items.nth(2)).toHaveAttribute("tabindex", "0");
});

test("published workflow applies root disabled state to every item", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  const group = page.locator("#disabled-toggle-group");
  const items = group.locator(itemSelector);

  await expect(group).toHaveAttribute("data-disabled", "true");
  await expect(items).toHaveCount(3);
  for (const item of await items.all()) {
    await expect(item).toHaveAttribute("data-disabled", "true");
    await expect(item).toHaveAttribute("tabindex", "-1");
  }
});

test("published workflow mirrors orientation, spacing, and live direction", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  const vertical = page.locator("#vertical-toggle-group");
  const rtl = page.locator("#rtl-toggle-group");
  const rtlItems = rtl.locator(itemSelector);

  await expect(vertical).toHaveAttribute("data-orientation", "vertical");
  await expect(vertical).toHaveCSS("--gap", "1");
  await expect(rtl).toHaveAttribute("data-direction", "rtl");
  await rtlItems.nth(0).focus();
  await rtlItems.nth(0).press("ArrowRight");
  await expect(rtlItems.nth(2)).toBeFocused();

  await page.getByRole("button", { name: "Change direction" }).click();
  await expect(rtl).toHaveAttribute("data-direction", "ltr");
});
