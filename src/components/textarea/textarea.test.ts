import { expect, test } from "@playwright/test";

test("textarea directive tracks empty state", async ({ page }) => {
  await page.goto("/docs/static/examples/components/textarea.html");

  const textarea = page.locator("#docs-textarea-message");
  await textarea.fill("");
  await expect(textarea).toHaveAttribute("data-empty", "true");
  await textarea.fill("Message");
  await expect(textarea).toHaveAttribute("data-empty", "false");
});

test("textarea directive mirrors native required state", async ({ page }) => {
  await page.goto("/docs/static/examples/components/textarea.html");
  const textarea = page.locator("#docs-textarea-message");
  await textarea.evaluate((element) => {
    element.setAttribute("required", "");
  });

  await expect(textarea).toHaveAttribute("data-required", "true");
  await expect(textarea).toHaveAttribute("aria-required", "true");
  await expect(textarea).toHaveAttribute("data-disabled", "false");
});

test("textarea directive syncs invalid state from attributes", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/components/textarea.html");

  const textarea = page.locator("#docs-textarea-message");
  await expect(textarea).toHaveAttribute("data-invalid", "false");

  await textarea.evaluate((element) => {
    element.setAttribute("aria-invalid", "true");
  });

  await expect(textarea).toHaveAttribute("data-invalid", "true");

  await textarea.evaluate((element) => {
    element.setAttribute("aria-invalid", "false");
  });

  await expect(textarea).toHaveAttribute("data-invalid", "false");
});

test("textarea reference states, fields, button action, and RTL model are functional", async ({
  page,
}) => {
  await page.setViewportSize({ height: 720, width: 900 });
  await page.goto("/docs/static/examples/components/textarea.html");
  await page.getByRole("button", { name: "Send message" }).click();
  await page.getByLabel("رسالتك").fill("مرحبا");
  await expect(page.getByRole("status")).toContainText("Message sent");
  await expect(page.locator("#docs-textarea-rtl")).toHaveValue("مرحبا");
  await expect(page.locator(".textarea-workflows")).toHaveScreenshot(
    "textarea-workflows-desktop.png",
    { animations: "disabled" },
  );
});
