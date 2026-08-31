import { expect, test } from "@playwright/test";

test("collapsible element example exposes the synced functional HTML contract", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/elements/collapsible.html");
  const root = page.locator("[ng-collapsible]");
  const trigger = page.getByRole("button", { name: "Toggle details" });
  const content = page.locator(
    `:is([data-slot=collapsible-content], [ng-collapsible-content])`,
  );

  await expect(root).toHaveAttribute("data-state", "closed");
  await trigger.click();
  await expect(root).toHaveAttribute("data-state", "open");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(content).toBeVisible();
});
