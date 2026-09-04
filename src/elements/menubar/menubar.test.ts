import { expect, test } from "@playwright/test";

test("menubar element example exercises the built functional artifact", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/elements/menubar.html");
  const menubar = page.locator("[ng-menubar]");
  const file = page.getByRole("menuitem", { name: "File", exact: true });
  const content = file.locator("..").locator(":scope > menu");
  await expect(menubar).toHaveAttribute("role", "menubar");
  await expect(content).toBeHidden();
  await file.press("Enter");
  await expect(content).toBeVisible();
  await expect(
    content.getByRole("menuitem", { name: /New Tab/ }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(content).toBeHidden();
  await expect(file).toBeFocused();

  const sourceRequests = await page.evaluate(() =>
    performance
      .getEntriesByType("resource")
      .map((entry) => entry.name)
      .filter((url) => /\/src\/(?:components|elements)\/.*\.ts$/.test(url)),
  );
  expect(sourceRequests).toEqual([]);
});
