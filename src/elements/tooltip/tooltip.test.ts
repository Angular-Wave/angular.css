import { expect, test } from "@playwright/test";

test("tooltip element example exercises the built functional artifact", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/elements/tooltip.html");

  const root = page.locator("[ng-tooltip]");
  const trigger = root.locator(":scope > :first-child");
  const content = root.locator(":scope > :last-child");
  await expect(content).toBeHidden();
  await trigger.focus();
  await expect(content).toBeVisible();
  await expect(trigger).toHaveAttribute(
    "aria-describedby",
    (await content.getAttribute("id")) ?? "",
  );
  await trigger.press("Escape");
  await expect(content).toBeHidden();

  const sourceRequests = await page.evaluate(() =>
    performance
      .getEntriesByType("resource")
      .map((entry) => entry.name)
      .filter((url) => /\/src\/(?:components|elements)\/.*\.ts$/.test(url)),
  );
  expect(sourceRequests).toEqual([]);
});
