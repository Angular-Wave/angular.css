import { expect, test } from "@playwright/test";

const canonicalUrl = "/docs/static/examples/components/tabs.html";
const workflowsUrl = "/docs/static/examples/components/tabs-workflows.html";
const triggerSelector = ':is([data-slot="tabs-trigger"], [ng-tabs-trigger])';
const panelSelector = ':is([data-slot="tabs-content"], [ng-tabs-content])';

test("published tabs activate panels by click and roving keyboard navigation", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  const tabs = page.locator("[ng-tabs]");
  const triggers = tabs.locator(triggerSelector);
  const panels = tabs.locator(panelSelector);
  const list = tabs.getByRole("tablist");

  await expect(list).toHaveAttribute("aria-orientation", "horizontal");
  await expect(triggers.nth(0)).toHaveAttribute("tabindex", "0");
  await expect(triggers.nth(1)).toHaveAttribute("tabindex", "-1");
  await expect(panels.nth(0)).toBeVisible();
  await expect(panels.nth(1)).toBeHidden();

  await triggers.nth(1).click();
  await expect(triggers.nth(1)).toHaveAttribute("aria-selected", "true");
  await expect(panels.nth(1)).toBeVisible();

  await triggers.nth(1).press("ArrowLeft");
  await expect(triggers.nth(0)).toBeFocused();
  await triggers.nth(0).press("End");
  await expect(triggers.nth(3)).toBeFocused();
  await triggers.nth(3).press("Home");
  await expect(triggers.nth(0)).toBeFocused();

  await triggers.nth(3).click();
  await expect(panels.nth(3)).toContainText(
    "Configure notifications, security, and themes.",
  );
  await expect(tabs).toHaveScreenshot("tabs-demo-desktop.png", {
    animations: "disabled",
  });
});

test("published vertical tabs use vertical arrow navigation", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  const tabs = page.locator("#vertical-tabs");
  const triggers = tabs.locator(triggerSelector);

  await expect(tabs).toHaveAttribute("data-orientation", "vertical");
  await expect(tabs.getByRole("tablist")).toHaveAttribute(
    "aria-orientation",
    "vertical",
  );
  await triggers.nth(0).focus();
  await triggers.nth(0).press("ArrowDown");
  await expect(triggers.nth(1)).toBeFocused();
  await triggers.nth(1).press("ArrowUp");
  await expect(triggers.nth(0)).toBeFocused();
});

test("published workflow binds tabs inserted by AngularTS", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  const tabs = page.locator("#dynamic-tabs");
  const triggers = tabs.locator(triggerSelector);
  const panels = tabs.locator(panelSelector);
  await expect(triggers).toHaveCount(2);

  await page.getByRole("button", { name: "Add advanced" }).click();
  await expect(triggers).toHaveCount(3);
  await expect(panels).toHaveCount(3);
  await expect(triggers.nth(2)).toHaveAttribute("role", "tab");
  await expect(panels.nth(2)).toHaveAttribute("role", "tabpanel");
  await expect(panels.nth(2)).toBeHidden();

  await triggers.nth(2).click();
  await expect(triggers.nth(2)).toHaveAttribute("aria-selected", "true");
  await expect(panels.nth(2)).toBeVisible();
});

test("published workflow moves selection when AngularTS disables the active tab", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  const tabs = page.locator("#disabled-tabs");
  const triggers = tabs.locator(triggerSelector);
  const panels = tabs.locator(panelSelector);

  await page.getByRole("button", { name: "Disable overview" }).click();
  await expect(triggers.nth(0)).toBeDisabled();
  await expect(triggers.nth(0)).toHaveAttribute("data-disabled", "true");
  await expect(triggers.nth(0)).toHaveAttribute("aria-selected", "false");
  await expect(triggers.nth(1)).toHaveAttribute("aria-selected", "true");
  await expect(panels.nth(1)).toBeVisible();
  await expect(triggers.nth(2)).toBeDisabled();
});

test("published tabs support RTL arrows and trigger-only visual variants", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  const rtlTabs = page.locator("#rtl-tabs");
  const rtlTriggers = rtlTabs.locator(triggerSelector);
  await expect(rtlTabs).toHaveAttribute("data-direction", "rtl");
  await rtlTriggers.nth(1).focus();
  await rtlTriggers.nth(1).press("ArrowRight");
  await expect(rtlTriggers.nth(0)).toBeFocused();
  await expect(rtlTriggers.nth(0)).toHaveAttribute("aria-selected", "true");

  const iconTabs = page.locator("#icon-tabs");
  const iconTriggers = iconTabs.locator(triggerSelector);
  await expect(iconTriggers).toHaveCount(2);
  await expect(iconTriggers.nth(0)).toHaveAttribute("role", "tab");
  await iconTriggers.nth(1).click();
  await expect(iconTriggers.nth(1)).toHaveAttribute("aria-selected", "true");
});
