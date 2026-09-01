import { expect, test, type Page } from "@playwright/test";

const canonicalUrl = "/docs/static/examples/components/select.html";
const workflowsUrl = "/docs/static/examples/components/select-workflows.html";
const statesUrl =
  "/docs/static/examples/components/select-state-workflows.html";

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

test("canonical artifact supplies Nova anatomy and updates AngularTS state", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  await expectBuiltArtifactRuntime(page);

  const root = page.locator("[ng-select]");
  const trigger = page.locator(".select-trigger");
  const content = page.locator(".select-content");
  const items = page.locator(".select-item");
  await expect(trigger).toHaveAttribute("role", "combobox");
  await expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(content).toHaveAttribute("role", "listbox");
  await expect(content).toBeHidden();
  await expect(items).toHaveCount(6);
  await expect(page.locator(".select-group")).toHaveAttribute(
    "aria-labelledby",
    /select-label-/,
  );
  await expect(trigger).toHaveCSS("height", "32px");
  await expect(trigger).toHaveCSS("box-shadow", "none");

  await trigger.click();
  await expect(content).toBeVisible();
  const contentBox = await content.boundingBox();
  expect(contentBox).not.toBeNull();
  expect(contentBox!.width).toBe(192);
  await page.getByRole("option", { name: "Banana", exact: true }).click();

  await expect(root).toHaveAttribute("data-value", "banana");
  await expect(page.locator(".select-value")).toHaveText("Banana");
  await expect(page.locator(".output")).toContainText("Selected: banana");
  await expect(content).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("keyboard navigation skips disabled options and drives the AngularTS model", async ({
  page,
}) => {
  await page.goto(statesUrl);
  await expectBuiltArtifactRuntime(page);
  const root = page.locator("#state-select");
  const trigger = root.locator(".select-trigger");
  const content = root.locator(".select-content");
  const items = root.locator(".select-item");

  await page.getByRole("button", { name: "Toggle popup" }).click();
  await expect(content).toBeVisible();
  await trigger.focus();
  await trigger.press("Home");
  await expect(items.nth(0)).toHaveAttribute("data-highlighted", "true");
  await trigger.press("ArrowDown");
  await expect(items.nth(1)).toHaveAttribute("aria-disabled", "true");
  await expect(items.nth(2)).toHaveAttribute("data-highlighted", "true");
  await trigger.press("Enter");
  await expect(root).toHaveAttribute("data-value", "done");
  await expect(page.locator(".select-state-output")).toContainText(
    "Selected: done",
  );
  await expect(content).toBeHidden();

  await page.getByRole("button", { name: "Toggle archived option" }).click();
  await expect(items).toHaveCount(4);
  await expect(items.nth(3)).toHaveAttribute("role", "option");
  await page.getByRole("button", { name: "Toggle popup" }).click();
  await trigger.focus();
  await trigger.press("a");
  await expect(items.nth(3)).toHaveAttribute("data-highlighted", "true");
  await trigger.press("Enter");
  await expect(page.locator(".select-state-output")).toContainText(
    "Selected: archived",
  );
});

test("grouped, disabled, and invalid references retain their semantics", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  await expectBuiltArtifactRuntime(page);

  const disabled = page.locator("#disabled-select");
  await expect(disabled).toHaveAttribute("data-disabled", "true");
  await expect(disabled.locator(".select-trigger")).toBeDisabled();
  await disabled.locator(".select-trigger").press("Enter");
  await expect(disabled.locator(".select-content")).toBeHidden();

  const grouped = page.locator("#grouped-select");
  await grouped.locator(".select-trigger").click();
  await expect(grouped.locator(".select-group")).toHaveCount(2);
  await expect(grouped.locator(".select-separator")).toHaveAttribute(
    "role",
    "separator",
  );
  await page.getByRole("option", { name: "Spinach", exact: true }).click();
  await expect(grouped).toHaveAttribute("data-value", "spinach");
  await expect(grouped.locator(".select-value")).toHaveText("Spinach");

  const invalidTrigger = page.locator("#invalid-select .select-trigger");
  await expect(invalidTrigger).toHaveAttribute("aria-invalid", "true");
  await expect(invalidTrigger).toHaveCSS("border-color", "rgb(229, 72, 77)");
  expect(
    await page.getByText("Please select a fruit.").getAttribute("role"),
  ).toBeNull();
});

test("align-item input changes popup placement without component-owned state", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  const root = page.locator("#align-select");
  const trigger = root.locator(".select-trigger");
  const content = root.locator(".select-content");
  const alignment = page.getByRole("checkbox", { name: "Align Item" });

  await expect(alignment).toBeChecked();
  await expect(content).toHaveAttribute("data-align-trigger", "true");
  await alignment.uncheck();
  await expect(content).toHaveAttribute("data-align-trigger", "false");
  await trigger.click();
  const triggerBox = await trigger.boundingBox();
  const contentBox = await content.boundingBox();
  expect(triggerBox).not.toBeNull();
  expect(contentBox).not.toBeNull();
  expect(contentBox!.y).toBeGreaterThanOrEqual(
    triggerBox!.y + triggerBox!.height + 3,
  );
});

test("RTL reference mirrors direction and preserves logical selection", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  const root = page.locator("#rtl-select");
  const content = root.locator(".select-content");
  await expect(root).toHaveAttribute("data-direction", "rtl");
  await expect(content).toHaveAttribute("data-direction", "rtl");
  await root.locator(".select-trigger").click();
  await page.getByRole("option", { name: "موز", exact: true }).click();
  await expect(root).toHaveAttribute("data-value", "banana");
  await expect(root.locator(".select-value")).toHaveText("موز");
});

test("scrollable reference exposes scroll controls and keeps active options visible", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  const root = page.locator("#timezone-select");
  const trigger = root.locator(".select-trigger");
  const content = root.locator(".select-content");
  await trigger.click();
  await expect(content).toBeVisible();
  await expect(content).toHaveAttribute("data-scroll-start", "true");
  const down = page.getByRole("button", { name: "Scroll options down" });
  await expect(down).toBeVisible();
  await down.click();
  await expect
    .poll(() => content.evaluate((element) => element.scrollTop))
    .toBeGreaterThan(0);
  await expect(
    page.getByRole("button", { name: "Scroll options up" }),
  ).toBeVisible();

  await trigger.focus();
  await trigger.press("End");
  const last = root.locator(".select-item").last();
  await expect(last).toHaveAttribute("data-highlighted", "true");
  await expect(last).toBeInViewport();
  await trigger.press("Enter");
  await expect(root).toHaveAttribute("data-value", "clt");
});

test("controlled open state is reflected from an AngularTS binding", async ({
  page,
}) => {
  await page.goto(statesUrl);
  const root = page.locator("#state-select");
  const content = root.locator(".select-content");
  await page.getByRole("button", { name: "Toggle popup" }).click();
  await expect(root).toHaveAttribute("open", "true");
  await expect(root).toHaveAttribute("data-open", "true");
  await expect(content).toBeVisible();
  await root.locator(".select-trigger").press("Escape");
  await expect(root).toHaveAttribute("open", "false");
  await expect(root).toHaveAttribute("data-open", "false");
  await expect(content).toBeHidden();

  await root.locator(".select-trigger").click();
  await expect(root).toHaveAttribute("open", "true");
  await page.getByRole("button", { name: "Toggle archived option" }).click();
  await expect(root).toHaveAttribute("open", "false");
  await expect(content).toBeHidden();
});
