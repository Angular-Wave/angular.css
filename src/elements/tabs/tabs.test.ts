import { expect, test } from "@playwright/test";

test("tabs element example exercises the built functional artifact", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/elements/tabs.html");
  const tabs = page.locator("[ng-tabs]");
  const triggers = tabs.getByRole("tab");
  const panels = tabs.locator('[data-slot="tabs-content"]');

  await expect(triggers).toHaveCount(4);
  await expect(panels.nth(0)).toBeVisible();
  await expect(panels.nth(1)).toBeHidden();
  await triggers.nth(1).click();
  await expect(triggers.nth(1)).toHaveAttribute("aria-selected", "true");
  await expect(panels.nth(1)).toBeVisible();
});
