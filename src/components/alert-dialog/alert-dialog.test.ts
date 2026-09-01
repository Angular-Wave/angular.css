import { expect, test, type Page } from "@playwright/test";

const canonicalUrl = "/docs/static/examples/components/alert-dialog.html";
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

test("canonical artifact owns alert-dialog semantics and focus restoration", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  await expectBuiltArtifactRuntime(page);
  const root = page.locator("#confirmation-dialog");
  const trigger = root.locator(".alert-dialog-trigger");
  const content = root.locator(".alert-dialog-content");
  const cancel = root.getByRole("button", { name: "Cancel" });

  await expect(content).toBeHidden();
  await expect(trigger).toHaveAttribute(
    "aria-controls",
    "confirmation-dialog-content",
  );
  await trigger.click();
  await expect(content).toBeVisible();
  await expect(content).toHaveAttribute("role", "alertdialog");
  await expect(content).toHaveAttribute("aria-modal", "true");
  await expect(content).toHaveAttribute("aria-labelledby", /-title$/);
  await expect(content).toHaveAttribute("aria-describedby", /-description$/);
  await expect(cancel).toBeFocused();
  await cancel.click();
  await expect(content).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("alert dialogs ignore overlay and outside clicks but close on Escape", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  const root = page.locator("#confirmation-dialog");
  const trigger = root.locator(".alert-dialog-trigger");
  const content = root.locator(".alert-dialog-content");

  await trigger.click();
  await root.locator(".alert-dialog-overlay").dispatchEvent("click");
  await expect(content).toBeVisible();
  await page.evaluate(() => {
    document.body.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
  await expect(content).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(content).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("action buttons close and AngularTS remains the application state owner", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  await expectBuiltArtifactRuntime(page);
  const root = page.locator("#delete-chat-dialog");
  const trigger = root.getByRole("button", { name: "Delete Chat" });
  const content = root.locator(".alert-dialog-content");

  await trigger.click();
  await root.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(content).toBeHidden();
  await expect(page.getByRole("status")).toContainText("Chat: deleted");
  await expect(trigger).toBeFocused();
});

test("workflow artifact preserves sizes, media, and RTL direction", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  const small = page.locator("#accessory-media-dialog");
  await small.locator(".alert-dialog-trigger").click();
  await expect(small.locator(".alert-dialog-content")).toHaveAttribute(
    "data-size",
    "sm",
  );
  await expect(small.locator(".alert-dialog-media")).toBeVisible();
  await page.keyboard.press("Escape");

  const rtl = page.locator("#rtl-confirmation-dialog");
  await rtl.locator(".alert-dialog-trigger").click();
  await expect(rtl).toHaveAttribute("data-direction", "rtl");
  await expect(rtl.locator(".alert-dialog-content")).toHaveAttribute(
    "data-direction",
    "rtl",
  );
});
