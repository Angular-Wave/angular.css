import { expect, test } from "@playwright/test";

test("navigation menu element example exercises the built functional artifact", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/elements/navigation-menu.html");

  const nav = page.getByRole("navigation", { name: "Primary navigation" });
  const trigger = nav.getByRole("button", { name: "Getting started" });
  const content = trigger
    .locator("..")
    .locator(":scope > .navigation-menu-content");
  await expect(content).toBeHidden();
  await trigger.click();
  await expect(content).toBeVisible();
  await expect(
    content.getByRole("link", { name: /Introduction/ }),
  ).toBeVisible();
  await expect(nav.getByRole("menuitem")).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(content).toBeHidden();
  await expect(trigger).toBeFocused();

  const sourceRequests = await page.evaluate(() =>
    performance
      .getEntriesByType("resource")
      .map((entry) => entry.name)
      .filter((url) => /\/src\/(?:components|elements)\/.*\.ts$/.test(url)),
  );
  expect(sourceRequests).toEqual([]);
});
