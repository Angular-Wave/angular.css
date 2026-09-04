import { expect, test } from "@playwright/test";

test("element sidebar page runs the packaged canonical artifact", async ({
  page,
}) => {
  await page.setViewportSize({ height: 700, width: 900 });
  await page.goto("/docs/static/examples/elements/sidebar.html");
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

  const sidebar = page.locator("#app-sidebar");
  const close = page.getByRole("button", { name: "Close Sidebar" });
  await expect(sidebar).not.toHaveAttribute("collapsed", "");
  await expect(sidebar).toHaveAttribute("collapsible", "icon");
  await expect(sidebar).toHaveAttribute("aria-hidden", "false");
  await close.click();
  await expect(sidebar).toHaveAttribute("collapsed", "");
  await expect(sidebar).toHaveAttribute("aria-hidden", "false");
  await expect(
    page.getByRole("button", { name: "Open Sidebar" }),
  ).toHaveAttribute("aria-expanded", "false");
});
