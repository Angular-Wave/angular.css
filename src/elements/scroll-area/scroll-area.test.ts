import { expect, test } from "@playwright/test";

test("scroll-area element example exercises the built functional artifact", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/elements/scroll-area.html");
  const root = page.locator("[ng-scroll-area]");
  const viewport = root.locator(".scroll-area-viewport");

  await expect(viewport).toHaveAttribute("tabindex", "0");
  await expect(viewport).toHaveAttribute("role", "region");
  await expect(root).toHaveAttribute("data-scrollable-x", "true");
  await expect(
    root.locator('.scroll-area-scrollbar[data-orientation="horizontal"]'),
  ).toHaveAttribute("data-visible", "true");
});
