import { expect, test } from "@playwright/test";

const statesUrl =
  "/docs/static/examples/components/input-group-state-workflows.html";
const workflowsUrl =
  "/docs/static/examples/components/input-group-workflows.html";
const compositionsUrl =
  "/docs/static/examples/components/input-group-compositions.html";
const textareaWorkflowsUrl =
  "/docs/static/examples/components/input-group-textarea-workflows.html";
const rtlUrl = "/docs/static/examples/components/input-group-rtl.html";

test("input group preserves authored addon descriptions", async ({ page }) => {
  await page.goto(statesUrl);

  const group = page.locator("#described-group");
  const input = group.locator("input");
  await expect(input).toHaveAttribute(
    "aria-describedby",
    "external-help currency-code",
  );
  await expect(group).not.toHaveAttribute("data-addon-count", /.+/);
});

test("input group exposes and operates an addon button", async ({ page }) => {
  await page.goto(statesUrl);

  const group = page.locator("#button-group");
  const input = group.locator("input");
  await expect(input).toHaveValue("AngularCSS");
  await group.getByRole("button", { name: "Clear" }).click();
  await expect(input).toHaveValue("");
});

test("input group lets AngularTS own dynamic addon context", async ({
  page,
}) => {
  await page.goto(statesUrl);

  const input = page.locator("#dynamic-group input");
  await expect(input).toHaveAttribute("aria-label", "Budget");
  await page.getByRole("button", { name: "Add currency" }).click();

  await expect(page.locator("#dynamic-addon")).toBeVisible();
  await expect(input).toHaveAttribute("aria-label", "Budget in USD");
  await expect(input).toHaveAttribute("aria-describedby", "budget-help");
});

test("input group preserves external descriptions as addons change", async ({
  page,
}) => {
  await page.goto(statesUrl);

  const input = page.locator("#hidden-group input");
  await expect(input).toHaveAttribute("aria-describedby", "price-help");
  await page
    .getByRole("button", { name: "Toggle currency description" })
    .click();

  await expect(page.locator("#addon-price")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
  await expect(input).toHaveAttribute("aria-describedby", "price-help");
});

test("input group examples match canonical geometry, state, and addon focus behavior", async ({
  page,
}) => {
  await page.setViewportSize({ height: 1800, width: 1280 });
  await page.goto(workflowsUrl);

  const basicGroup = page.locator("#ig-basic").locator("..");
  const basicBox = await basicGroup.boundingBox();
  expect(basicBox).not.toBeNull();
  expect(basicBox!.height).toBeCloseTo(32, 0);
  await expect(page.locator("#ig-disabled").locator("..")).toHaveCSS(
    "opacity",
    "0.5",
  );
  await expect(page.locator("#ig-invalid").locator("..")).not.toHaveCSS(
    "box-shadow",
    "none",
  );

  const commandInput = page.locator("#ig-command-search");
  await commandInput
    .locator("..")
    .locator(".input-group-addon")
    .first()
    .click();
  await expect(commandInput).toBeFocused();

  await page.getByLabel("Search documentation").fill("angular");
  await expect(page.getByRole("status").first()).toContainText("angular");
  await page.getByLabel("@").click();
  await expect(page.locator("#ig-email-name")).toBeFocused();

  await page.getByRole("button", { name: "Submit" }).click();
  await expect(page.getByRole("status").last()).toHaveText("Submitted");

  await expect(page.locator(".input-group-workflow-grid")).toHaveScreenshot(
    "input-group-workflows-desktop.png",
    { animations: "disabled" },
  );
});

test("input group menu, tooltip, popover, and button compositions are functional", async ({
  page,
}) => {
  await page.setViewportSize({ height: 1500, width: 1100 });
  await page.goto(compositionsUrl);

  await page.getByRole("button", { name: "Copy URL" }).click();
  await expect(page.getByRole("status")).toContainText("Copied URL");

  await page.getByRole("button", { name: "File options" }).click();
  await expect(page.getByRole("menuitem", { name: "Copy path" })).toBeVisible();
  await page.getByRole("menuitem", { name: "Copy path" }).click();
  await expect(page.getByRole("status")).toContainText("Copied path");

  const tooltipTrigger = page.getByRole("button", {
    name: "Password information",
  });
  await tooltipTrigger.focus();
  await expect(
    page.getByRole("tooltip", {
      name: "Password must be at least 8 characters.",
    }),
  ).toBeVisible();
  await tooltipTrigger.blur();

  await page.getByRole("button", { name: "Security details" }).click();
  await expect(
    page.getByRole("complementary", { name: "Security details" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");

  await page.getByRole("button", { name: /\+1/ }).click();
  await page.getByRole("menuitem", { name: "+44", exact: true }).click();
  await expect(page.getByRole("button", { name: /\+44/ })).toBeVisible();

  await expect(page.locator(".input-group-composition-grid")).toHaveScreenshot(
    "input-group-compositions-desktop.png",
    { animations: "disabled" },
  );
});

test("input group textarea examples preserve AngularTS state and native autosizing", async ({
  page,
}) => {
  await page.setViewportSize({ height: 1800, width: 1100 });
  await page.goto(textareaWorkflowsUrl);

  await page.locator("#igt-comment").fill("Hello");
  await expect(
    page.locator("#igt-comment").locator("..").getByText("5/280"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Post", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Posted comment");

  await page.getByLabel("JavaScript code").fill("const value = 1;");
  await expect(page.getByText("Line 1, Column 17")).toBeVisible();
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Ran code");

  const autosize = page.getByLabel("Autosize textarea");
  const initialHeight = await autosize.evaluate(
    (element) => element.getBoundingClientRect().height,
  );
  await autosize.fill("One\nTwo\nThree\nFour\nFive");
  expect(
    await autosize.evaluate(
      (element) => element.getBoundingClientRect().height,
    ),
  ).toBeGreaterThan(initialHeight);

  await expect(page.locator(".input-group-textarea-grid")).toHaveScreenshot(
    "input-group-textarea-workflows-desktop.png",
    { animations: "disabled" },
  );
});

test("input group RTL example keeps logical addon order and application state", async ({
  page,
}) => {
  await page.setViewportSize({ height: 640, width: 700 });
  await page.goto(rtlUrl);

  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await page.locator('[aria-label="بحث"]').fill("مكونات");
  await page.getByLabel("منطقة النص").fill("تعليق");
  await page.getByRole("button", { name: "نشر" }).click();
  const rtlStatus = page.locator(".input-group-output");
  await expect(rtlStatus).toContainText("تم النشر");
  await expect(rtlStatus).toContainText("مكونات");
  await expect(page.locator(".input-group-rtl-workflow")).toHaveScreenshot(
    "input-group-rtl-desktop.png",
    { animations: "disabled" },
  );
});
