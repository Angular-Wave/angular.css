import { expect, test } from "@playwright/test";

const exampleUrl = "/docs/static/examples/components/skeleton.html";

test("skeleton marks an unlabeled placeholder as decorative loading UI", async ({
  page,
}) => {
  await page.goto(exampleUrl);

  const skeleton = page.locator("#decorative-skeleton");
  await expect(skeleton).toHaveAttribute("data-loading", "true");
  await expect(skeleton).toHaveAttribute("aria-hidden", "true");
});

test("skeleton preserves an explicit accessible label", async ({ page }) => {
  await page.goto(exampleUrl);

  const skeleton = page.locator("#labeled-skeleton");
  await expect(skeleton).toHaveAttribute("aria-label", "Loading avatar");
  await expect(skeleton).toHaveAttribute("aria-hidden", "false");
  await expect(skeleton).toHaveAttribute("data-loading", "true");
});

test("skeleton reference layouts cover avatar, card, form, text, table, and RTL", async ({
  page,
}) => {
  await page.setViewportSize({ height: 760, width: 1000 });
  await page.goto(exampleUrl);
  await expect(page.locator("[ng-skeleton]")).toHaveCount(28);
  await expect(page.locator(".skeleton-rtl-demo")).toHaveAttribute(
    "dir",
    "rtl",
  );
  await expect(page.locator(".skeleton-workflows")).toHaveScreenshot(
    "skeleton-workflows-desktop.png",
    { animations: "disabled" },
  );
});
