import { expect, test } from "@playwright/test";

test("scroll-area element example uses a native overflow region", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/elements/scroll-area.html");
  const root = page.locator(".scroll-area");

  await expect(root).toHaveAttribute("tabindex", "0");
  await expect(root).toHaveAttribute("aria-label", "Release tags");
  expect(
    await root.evaluate((element) => element.scrollWidth > element.clientWidth),
  ).toBe(true);
  await root.focus();
  await expect(root).toBeFocused();
});
