import { expect, test } from "@playwright/test";

test("hover card element example exercises the built functional artifact", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/elements/hover-card.html");

  const trigger = page.locator("[ng-hover-card] > :is(a, button)");
  const content = page.locator("[ng-hover-card] > aside");
  await expect(content).toBeHidden();
  await trigger.focus();
  await expect(content).toBeVisible();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await trigger.blur();
  await expect(content).toBeHidden();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});
