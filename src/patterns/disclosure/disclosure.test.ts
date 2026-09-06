import { expect, test } from "@playwright/test";

const canonicalUrl = "/src/patterns/disclosure/disclosure.html";
const workflowsUrl =
  "/docs/static/examples/components/disclosure-workflows.html";
const compositionsUrl =
  "/docs/static/examples/components/disclosure-compositions.html";

test("canonical disclosure is a native details disclosure", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  const root = page.locator("details.disclosure");
  const trigger = root.locator(":scope > summary");
  const content = root.locator(":scope > :last-child");

  await expect(page.locator("body")).toHaveAttribute(
    "data-example",
    "disclosure-demo",
  );
  await expect(root).not.toHaveAttribute("open", "");
  await expect(content).toBeHidden();
  await expect(page.getByText("Status", { exact: true })).toBeVisible();
  await trigger.click();
  await expect(root).toHaveAttribute("open", "");
  await expect(content).toBeVisible();
  await expect(page.getByText("Status", { exact: true })).toBeVisible();
  await expect(root).toHaveScreenshot("disclosure-open-desktop.png", {
    animations: "disabled",
  });
});

test("disclosure motion is CSS-only and respects reduced motion", async ({
  browser,
}) => {
  const animatedPage = await browser.newPage({
    reducedMotion: "no-preference",
  });
  await animatedPage.goto(canonicalUrl);
  const root = animatedPage.locator("details.disclosure");
  const trigger = root.locator(":scope > summary");
  const icon = trigger.locator("svg").first();
  const triggerBox = await trigger.boundingBox();
  if (!triggerBox) throw new Error("Disclosure trigger is not rendered");

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
  const reducedRoot = reducedPage.locator("details.disclosure");
  await expect(reducedRoot.locator("summary svg").first()).toHaveCSS(
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

test("disclosure workflows use native details for basic, settings, and RTL", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  const product = page.locator(".disclosure-product");
  const settings = page.locator(".disclosure-settings");
  const settingsDisclosure = settings.locator("details");
  const rtl = page.locator(".disclosure-workflow-wide");

  await expect(product).not.toHaveAttribute("open", "");
  await product.locator("summary").press("Enter");
  await expect(product).toHaveAttribute("open", "");
  await expect(product.locator(":scope > :last-child")).toBeVisible();

  await expect(settings.locator("input")).toHaveCount(4);
  await expect(settings.locator("input:visible")).toHaveCount(2);
  await settingsDisclosure.locator("summary").click();
  await expect(settingsDisclosure).toHaveAttribute("open", "");
  await expect(settings.locator("input:visible")).toHaveCount(4);
  await expect(settings.locator(".disclosure-minimize")).toBeVisible();

  await expect(rtl).toHaveAttribute("dir", "rtl");
  await rtl.locator("summary").click();
  await expect(rtl.locator("details")).toHaveAttribute("open", "");
  await expect(rtl.locator("details > :last-child")).toBeVisible();
});

test("disclosure file tree expands nested folders without hiding sibling files", async ({
  page,
}) => {
  await page.goto(compositionsUrl);
  const tree = page.locator(".disclosure-file-tree");
  const components = tree
    .locator("details")
    .filter({ hasText: "components" })
    .first();

  await expect(page.locator("body")).toHaveAttribute(
    "data-example",
    "disclosure-file-tree",
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
