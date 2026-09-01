import { expect, test } from "@playwright/test";

const canonicalUrl = "/docs/static/examples/components/collapsible.html";
const workflowsUrl =
  "/docs/static/examples/components/collapsible-workflows.html";
const compositionsUrl =
  "/docs/static/examples/components/collapsible-compositions.html";

test("canonical collapsible keeps order state in AngularTS and panel state in the directive", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  const root = page.locator("[ng-collapsible]");
  const trigger = page.getByRole("button", { name: "Toggle details" });
  const content = page.locator(`.collapsible-content`);

  await expect(page.locator("body")).toHaveAttribute(
    "data-example",
    "collapsible-demo",
  );
  await expect(root).toHaveAttribute("data-state", "closed");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(content).toBeHidden();
  await expect(page.getByText("Status", { exact: true })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("collapsed");

  await trigger.click();
  await expect(root).toHaveAttribute("data-state", "open");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(content).toBeVisible();
  await expect(page.getByRole("status")).toContainText("expanded");
  const triggerId = await trigger.getAttribute("id");
  expect(triggerId).not.toBeNull();
  await expect(content).toHaveAttribute("aria-labelledby", triggerId!);
});

test("collapsible workflows cover native details, custom settings, and RTL", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  const product = page.locator(".collapsible-product");
  const settings = page.locator(".collapsible-settings");
  const settingsTrigger = page.getByRole("button", {
    name: "Toggle additional radius settings",
  });
  const rtl = page.locator(".collapsible-workflow-wide");

  await expect(page.locator("body")).toHaveAttribute(
    "data-example",
    "collapsible-basic collapsible-rtl collapsible-settings",
  );
  await expect(product).not.toHaveAttribute("open", "");
  await product.locator("summary").press("Enter");
  await expect(product).toHaveAttribute("open", "");
  await expect(product.locator(`.collapsible-content`)).toBeVisible();

  await expect(settings.locator("input")).toHaveCount(4);
  await expect(settings.locator("input:visible")).toHaveCount(2);
  await settingsTrigger.click();
  await expect(settings).toHaveAttribute("data-state", "open");
  await expect(settings.locator("input:visible")).toHaveCount(4);
  await expect(settings.locator(".collapsible-minimize")).toBeVisible();

  await expect(rtl).toHaveAttribute("dir", "rtl");
  await rtl.getByRole("button", { name: "تبديل التفاصيل" }).click();
  await expect(rtl.locator(`.collapsible-content`)).toBeVisible();
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
  await expect(tree.getByText("login-form.tsx", { exact: true })).toBeVisible();

  const ui = components.locator("details").first();
  await ui.locator(":scope > summary").click();
  await expect(tree.getByText("button.tsx", { exact: true })).toBeVisible();
  await expect(ui.locator(":scope > summary")).toHaveAttribute(
    "aria-expanded",
    "true",
  );
});
