import { expect, test } from "@playwright/test";

const canonicalUrl = "/docs/static/examples/components/carousel.html";
const workflowsUrl = "/docs/static/examples/components/carousel-workflows.html";
const compositionsUrl =
  "/docs/static/examples/components/carousel-compositions.html";

test("canonical carousel exposes semantics and navigates with controls and keys", async ({
  page,
}) => {
  await page.goto(canonicalUrl);

  const carousel = page.locator("[ng-carousel]");
  const items = carousel.locator(":scope > * > :is(ul, ol) > li");
  const previous = carousel.locator(":scope > button").first();
  const next = carousel.locator(":scope > button").nth(1);

  expect(await carousel.getAttribute("role")).toBeNull();
  await expect(carousel).toHaveAttribute("aria-roledescription", "carousel");
  await expect(items).toHaveCount(5);
  await expect(items.first()).toHaveAttribute("aria-roledescription", "slide");
  await expect(items.first()).toHaveAttribute("aria-label", "1 of 5");
  await expect(items.first()).toHaveAttribute("aria-hidden", "false");
  await expect(previous).toBeDisabled();
  await expect(next).toBeEnabled();

  const firstBefore = await items.first().boundingBox();
  const secondBefore = await items.nth(1).boundingBox();
  if (!firstBefore || !secondBefore) {
    throw new Error("Carousel slides are not rendered");
  }

  await next.click();
  await expect(items.nth(1)).toHaveAttribute("aria-hidden", "false");
  await expect
    .poll(async () => (await items.nth(1).boundingBox())?.x)
    .toBeCloseTo(secondBefore.x - firstBefore.width, 0);

  await carousel.press("ArrowRight");
  await expect(items.nth(2)).toHaveAttribute("aria-hidden", "false");
  await carousel.press("ArrowLeft");
  await expect(items.nth(1)).toHaveAttribute("aria-hidden", "false");
});

test("carousel drag gesture selects the next snap", async ({ page }) => {
  await page.goto(canonicalUrl);

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

test("API example binds Embla selection detail through AngularTS", async ({
  page,
}) => {
  await page.goto(workflowsUrl);

  const workflow = page.locator("[aria-labelledby='carousel-api-heading']");
  const carousel = workflow.locator("[ng-carousel]");
  const status = workflow.locator(".carousel-status");

  await expect(status).toHaveText("Slide 1 of 5");
  await carousel.locator(":scope > button").nth(1).click();
  await expect(status).toHaveText("Slide 2 of 5");
});

test("multi-item carousel uses visible slide basis and snap boundaries", async ({
  page,
}) => {
  await page.goto(workflowsUrl);

  const carousel = page.locator(".carousel-multiple-demo");
  const items = carousel.locator(":scope > * > :is(ul, ol) > li");
  const cards = carousel.locator(".card");
  const viewport = carousel.locator(":scope > div:first-of-type");
  const viewportBox = await viewport.boundingBox();
  const itemBox = await items.first().boundingBox();
  const cardBox = await cards.first().boundingBox();
  if (!viewportBox || !itemBox || !cardBox)
    throw new Error("Multi-item carousel is hidden");

  expect(itemBox.width / viewportBox.width).toBeGreaterThan(0.34);
  expect(itemBox.width / viewportBox.width).toBeLessThan(0.36);
  expect(cardBox.width / viewportBox.width).toBeGreaterThan(0.28);
  expect(cardBox.width / viewportBox.width).toBeLessThan(0.32);
  await carousel.locator(":scope > button").nth(1).click();
  await expect(items.nth(3)).toHaveAttribute("aria-hidden", "false");
});

test("vertical carousel uses vertical geometry and arrow keys", async ({
  page,
}) => {
  await page.goto(workflowsUrl);

  const carousel = page.locator(".carousel-vertical-demo");
  const first = carousel.locator(":scope > * > :is(ul, ol) > li").first();
  const second = carousel.locator(":scope > * > :is(ul, ol) > li").nth(1);
  const cards = carousel.locator(".card");
  const firstBox = await first.boundingBox();
  const secondBox = await second.boundingBox();
  const firstCardBox = await cards.first().boundingBox();
  const secondCardBox = await cards.nth(1).boundingBox();
  if (!firstBox || !secondBox || !firstCardBox || !secondCardBox) {
    throw new Error("Vertical slides are hidden");
  }

  expect(secondBox.y).toBeCloseTo(firstBox.y + firstBox.height, 0);
  expect(secondCardBox.y).toBeGreaterThan(firstCardBox.y + firstCardBox.height);
  await expect(carousel).toHaveAttribute("orientation", "vertical");
  await carousel.press("ArrowDown");
  await expect(second).toHaveAttribute("aria-hidden", "false");
  await carousel.press("ArrowRight");
  await expect(second).toHaveAttribute("aria-hidden", "false");
  await carousel.press("ArrowUp");
  await expect(first).toHaveAttribute("aria-hidden", "false");
});

test("autoplay advances and pauses while hovered", async ({ page }) => {
  await page.goto(workflowsUrl);

  const carousel = page.locator(`[aria-label="Autoplay numbered slides"]`);
  const status = page.locator(".carousel-status").last();
  const initial = await status.textContent();
  await expect
    .poll(() => status.textContent(), { timeout: 3000 })
    .not.toEqual(initial);
  await carousel.hover();
  await page.waitForTimeout(250);
  const hovered = await status.textContent();
  await page.waitForTimeout(2200);
  expect(await status.textContent()).toEqual(hovered);
});

test("RTL carousel preserves logical direction and functional controls", async ({
  page,
}) => {
  await page.goto(compositionsUrl);

  const carousel = page.locator(`[ng-carousel][dir="rtl"]`);
  const previous = carousel.locator(":scope > button").first();
  const next = carousel.locator(":scope > button").nth(1);
  const previousBox = await previous.boundingBox();
  const nextBox = await next.boundingBox();
  if (!previousBox || !nextBox) throw new Error("RTL controls are hidden");

  await expect(carousel).toHaveCSS("direction", "rtl");
  expect(previousBox.x).toBeGreaterThan(nextBox.x);
  await next.click();
  await expect(
    carousel.locator(":scope > * > :is(ul, ol) > li").nth(1),
  ).toHaveAttribute("aria-hidden", "false");
});

test("custom spacing and sizing remain authored CSS concerns", async ({
  page,
}) => {
  await page.goto(compositionsUrl);

  const sized = page.locator(".carousel-size-demo");
  const spaced = page.locator(".carousel-spacing-demo");
  const sizedItems = sized.locator(":scope > * > :is(ul, ol) > li");
  const spacedCards = spaced.locator(".card");
  const sizedFirst = await sizedItems.first().boundingBox();
  const spacedFirst = await spacedCards.first().boundingBox();
  const spacedSecond = await spacedCards.nth(1).boundingBox();
  if (!sizedFirst || !spacedFirst || !spacedSecond) {
    throw new Error("Sized carousel items are hidden");
  }

  expect(sizedFirst.width).toBeGreaterThan(100);
  expect(spacedSecond.x - (spacedFirst.x + spacedFirst.width)).toBeCloseTo(
    12,
    0,
  );
});

test("carousel examples match the reference responsive widths and bases", async ({
  page,
}) => {
  const expectWidth = async (selector: string, width: number) => {
    await expect
      .poll(
        async () => (await page.locator(selector).first().boundingBox())?.width,
      )
      .toBeCloseTo(width, 0);
  };

  await page.setViewportSize({ height: 1200, width: 420 });
  await page.goto(canonicalUrl);
  await expectWidth(".carousel-demo", 192);

  await page.goto(workflowsUrl);
  await expectWidth(".carousel-api-demo", 160);
  await expectWidth(".carousel-multiple-demo", 320);
  await expectWidth(".carousel-vertical-demo", 320);
  await expect(
    page.locator(".carousel-multiple-demo > button").first(),
  ).toBeHidden();
  const compactMultiple = await page
    .locator(".carousel-multiple-demo > :has(> ul) > ul > li")
    .first()
    .boundingBox();
  expect(compactMultiple?.width).toBeGreaterThan(320);

  await page.setViewportSize({ height: 1200, width: 700 });
  await expectWidth(".carousel-api-demo", 320);
  await expectWidth(".carousel-multiple-demo", 384);
  await expectWidth(".carousel-vertical-demo", 320);
  await expect(
    page.locator(".carousel-multiple-demo > button").first(),
  ).toBeVisible();

  await page.setViewportSize({ height: 1200, width: 420 });
  await page.goto(compositionsUrl);
  await expectWidth(".carousel-demo", 192);
  await expectWidth(".carousel-size-demo", 192);
  await expectWidth(".carousel-spacing-demo", 192);

  await page.setViewportSize({ height: 1200, width: 1000 });
  await expectWidth(".carousel-demo", 320);
  await expectWidth(".carousel-size-demo", 384);
  await expectWidth(".carousel-spacing-demo", 384);
});

test("carousel reinitializes when slides are inserted", async ({ page }) => {
  await page.goto(canonicalUrl);

  const carousel = page.locator("[ng-carousel]");
  await carousel.locator(":scope > * > :is(ul, ol)").evaluate((track) => {
    const slide = document.createElement("li");
    slide.innerHTML = "<div>6</div>";
    track.append(slide);
  });

  await expect(carousel.locator(":scope > * > :is(ul, ol) > li")).toHaveCount(
    6,
  );
  await expect(
    carousel.locator(":scope > * > :is(ul, ol) > li").nth(5),
  ).toHaveAttribute("aria-label", "6 of 6");
});
