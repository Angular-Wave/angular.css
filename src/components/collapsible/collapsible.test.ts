import { expect, test } from "@playwright/test";

const canonicalUrl = "/docs/static/examples/components/collapsible.html";
const workflowsUrl =
  "/docs/static/examples/components/collapsible-workflows.html";
const compositionsUrl =
  "/docs/static/examples/components/collapsible-compositions.html";

test("canonical collapsible is a native details disclosure", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  const root = page.locator("details.collapsible");
  const trigger = root.locator(":scope > summary");
  const content = root.locator(":scope > .collapsible-content");

  await expect(page.locator("body")).toHaveAttribute(
    "data-example",
    "collapsible-demo",
  );
  await expect(root).not.toHaveAttribute("ng-collapsible", "");
  await expect(root).not.toHaveAttribute("open", "");
  await expect(content).toBeHidden();
  await expect(page.getByText("Status", { exact: true })).toBeVisible();
  await trigger.click();
  await expect(root).toHaveAttribute("open", "");
  await expect(content).toBeVisible();
  await expect(page.getByText("Status", { exact: true })).toBeVisible();
  await expect(root).toHaveScreenshot("collapsible-open-desktop.png", {
    animations: "disabled",
  });
});

test("collapsible motion is CSS-only and respects reduced motion", async ({
  browser,
}) => {
  const animatedPage = await browser.newPage({
    reducedMotion: "no-preference",
  });
  await animatedPage.goto(canonicalUrl);
  const root = animatedPage.locator("details.collapsible");
  const trigger = root.locator(":scope > summary");
  const icon = trigger.locator(".collapsible-icon-button");
  const triggerBox = await trigger.boundingBox();
  if (!triggerBox) throw new Error("Collapsible trigger is not rendered");

  await animatedPage.mouse.move(
    triggerBox.x + triggerBox.width - 16,
    triggerBox.y + 16,
  );
  await animatedPage.mouse.down();
  await expect(icon).toHaveCSS("translate", "0px 1px");
  await expect(icon).toHaveCSS("scale", "none");
  await animatedPage.mouse.up();
  const animatedContent = await root.evaluate(
    (element) =>
      getComputedStyle(element, "::details-content").transitionDuration,
  );
  expect(animatedContent).not.toBe("0s");
  await animatedPage.close();

  const reducedPage = await browser.newPage({ reducedMotion: "reduce" });
  await reducedPage.goto(canonicalUrl);
  const reducedRoot = reducedPage.locator("details.collapsible");
  await expect(reducedRoot.locator(".collapsible-icon-button")).toHaveCSS(
    "transition-duration",
    "0s",
  );
  const reducedContent = await reducedRoot.evaluate(
    (element) =>
      getComputedStyle(element, "::details-content").transitionDuration,
  );
  expect(reducedContent).toBe("0s");
  await reducedPage.close();
});

test("collapsible workflows use native details for basic, settings, and RTL", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  const product = page.locator(".collapsible-product");
  const settings = page.locator(".collapsible-settings");
  const settingsDisclosure = settings.locator("details");
  const rtl = page.locator(".collapsible-workflow-wide");

  await expect(product).not.toHaveAttribute("open", "");
  await product.locator("summary").press("Enter");
  await expect(product).toHaveAttribute("open", "");
  await expect(product.locator(".collapsible-content")).toBeVisible();

  await expect(settings.locator("input")).toHaveCount(4);
  await expect(settings.locator("input:visible")).toHaveCount(2);
  await settingsDisclosure.locator("summary").click();
  await expect(settingsDisclosure).toHaveAttribute("open", "");
  await expect(settings.locator("input:visible")).toHaveCount(4);
  await expect(settings.locator(".collapsible-minimize")).toBeVisible();

  await expect(rtl).toHaveAttribute("dir", "rtl");
  await rtl.locator("summary").click();
  await expect(rtl.locator("details")).toHaveAttribute("open", "");
  await expect(rtl.locator(".collapsible-content")).toBeVisible();
});

test("collapsible file tree expands nested folders without hiding sibling files", async ({
  page,
}) => {
  await page.goto(compositionsUrl);
  const tree = page.locator(".collapsible-file-tree");
  const components = tree
    .locator("details")
    .filter({ hasText: "components" })
    .first();

  await expect(page.locator("body")).toHaveAttribute(
    "data-example",
    "collapsible-file-tree",
  );
  await expect(tree.getByText("app.tsx", { exact: true })).toBeVisible();
  await expect(tree.getByText("login-form.tsx", { exact: true })).toBeHidden();
  await components.locator(":scope > summary").click();
  await expect(components).toHaveAttribute("open", "");
  await expect(tree.getByText("login-form.tsx", { exact: true })).toBeVisible();

  const ui = components.locator("details").first();
  await ui.locator(":scope > summary").click();
  await expect(ui).toHaveAttribute("open", "");
  await expect(tree.getByText("button.tsx", { exact: true })).toBeVisible();
});
