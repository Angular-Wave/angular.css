import { expect, test, type Page } from "@playwright/test";

const canonicalUrl = "/src/recipes/alert-dialog/alert-dialog.html";
const workflowsUrl =
  "/docs/static/examples/components/alert-dialog-workflows.html";

const expectBuiltArtifactRuntime = async (page: Page): Promise<void> => {
  await expect(
    page.locator('script[src$="/js/angular-ts.umd.js"]'),
  ).toHaveCount(1);
  await expect(
    page.locator('script[src$="/js/angular-css.umd.js"]'),
  ).toHaveCount(1);
  const sourceRequests = await page.evaluate(() =>
    performance
      .getEntriesByType("resource")
      .map((entry) => entry.name)
      .filter((url) => /\/src\/(?:components|elements)\/.*\.ts$/.test(url)),
  );
  expect(sourceRequests).toEqual([]);
};

test("canonical alert dialog uses native modal semantics and focus restoration", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  await expectBuiltArtifactRuntime(page);
  const root = page.locator("#confirmation-dialog");
  const trigger = root.locator(":scope > button:first-child");
  const content = root.locator("dialog");
  const cancel = root.getByRole("button", { name: "Cancel" });

  await expect(content).toBeHidden();
  await expect(trigger).toHaveAttribute(
    "commandfor",
    "confirmation-dialog-content",
  );
  await trigger.click();
  await expect(content).toHaveAttribute("open", "");
  expect(await content.evaluate((dialog) => dialog.matches(":modal"))).toBe(
    true,
  );
  await expect(content).toHaveAttribute(
    "aria-labelledby",
    "confirmation-dialog-title",
  );
  await expect(cancel).toBeFocused();
  await cancel.click();
  await expect(content).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("closedby prevents light dismissal but allows Escape", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  const root = page.locator("#confirmation-dialog");
  const trigger = root.locator(":scope > button:first-child");
  const content = root.locator("dialog");

  await trigger.click();
  await expect(content).toHaveAttribute("closedby", "closerequest");
  await page.mouse.click(2, 2);
  await expect(content).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(content).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("workflow actions close while AngularTS owns application state", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  await expectBuiltArtifactRuntime(page);
  const root = page.locator("#delete-chat-dialog");
  const trigger = root.getByRole("button", { name: "Delete Chat" });

  await trigger.click();
  await root.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(root.locator("dialog")).toBeHidden();
  await expect(page.getByRole("status")).toContainText("Chat: deleted");
  await expect(trigger).toBeFocused();
});

test("workflow preserves sizes, media, and inherited RTL direction", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  const small = page.locator("#accessory-media-dialog");
  await small.locator(":scope > button:first-child").click();
  await expect(small.locator("dialog")).toHaveAttribute("size", "sm");
  await expect(
    small.locator(":scope > dialog > header > figure"),
  ).toBeVisible();
  await page.keyboard.press("Escape");

  const rtl = page.locator("#rtl-confirmation-dialog");
  await rtl.locator(":scope > button:first-child").click();
  await expect(rtl.locator("dialog")).toHaveCSS("direction", "rtl");
});
