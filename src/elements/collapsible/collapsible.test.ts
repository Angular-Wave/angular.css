import { expect, test } from "@playwright/test";

test("collapsible element example exposes the synced functional HTML contract", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/elements/collapsible.html");
  const root = page.locator("details.collapsible");
  const trigger = root.locator(":scope > summary");
  const content = page.locator(`.collapsible-content`);

  await expect(root).not.toHaveAttribute("open", "");
  await trigger.click();
  await expect(root).toHaveAttribute("open", "");
  await expect(content).toBeVisible();
});
