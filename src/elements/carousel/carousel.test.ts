import { expect, test } from "@playwright/test";

test("element entrypoint example is a functional carousel page", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/elements/carousel.html");

  const carousel = page.locator("[ng-carousel]");
  const items = carousel.locator(":scope > * > :is(ul, ol) > li");
  await expect(items).toHaveCount(5);
  await expect(items.first()).toHaveAttribute("aria-hidden", "false");

  await carousel.locator(":scope > button").nth(1).click();
  await expect(items.nth(1)).toHaveAttribute("aria-hidden", "false");
});

test("element carousel example supports drag interaction", async ({ page }) => {
  await page.goto("/docs/static/examples/elements/carousel.html");

  const carousel = page.locator("[ng-carousel]");
  const viewport = carousel.locator(":scope > div:first-of-type");
  const box = await viewport.boundingBox();
  if (!box) throw new Error("Carousel viewport is not rendered");

  await page.mouse.move(box.x + box.width * 0.8, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.2, box.y + box.height / 2, {
    steps: 8,
  });
  await page.mouse.up();
  await expect(
    carousel.locator(":scope > * > :is(ul, ol) > li").nth(1),
  ).toHaveAttribute("aria-hidden", "false");
});
