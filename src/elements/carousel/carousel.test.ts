import { expect, test } from "@playwright/test";

test("element entrypoint example is a functional carousel page", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/elements/carousel.html");

  const carousel = page.locator("[ng-carousel]");
  const items = carousel.locator(
    `:is([data-slot=carousel-item], [ng-carousel-item])`,
  );
  await expect(carousel).toHaveAttribute("data-count", "5");
  await expect(items.first()).toHaveAttribute("data-active", "true");

  await carousel.locator("[ng-carousel-next]").click();
  await expect(carousel).toHaveAttribute("data-index", "1");
  await expect(items.nth(1)).toHaveAttribute("data-active", "true");
});

test("element carousel example supports drag interaction", async ({ page }) => {
  await page.goto("/docs/static/examples/elements/carousel.html");

  const carousel = page.locator("[ng-carousel]");
  const viewport = carousel.locator(
    `:is([data-slot=carousel-content], [ng-carousel-content])`,
  );
  const box = await viewport.boundingBox();
  if (!box) throw new Error("Carousel viewport is not rendered");

  await page.mouse.move(box.x + box.width * 0.8, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.2, box.y + box.height / 2, {
    steps: 8,
  });
  await page.mouse.up();
  await expect(carousel).toHaveAttribute("data-index", "1");
});
