import { expect, test } from "@playwright/test";

test("avatar uses fallback when image is missing", async ({ page }) => {
  await page.goto("/docs/static/examples/components/avatar.html");
  const avatar = page.locator("[ng-avatar]").first();
  const fallback = avatar.locator(".avatar-fallback");

  await avatar.locator(".avatar-image").evaluate((image) => {
    (image as HTMLImageElement).src = "/missing-avatar.png";
  });

  await expect(avatar).toHaveAttribute("data-state", "fallback");
  await expect(fallback).toBeVisible();
});

test("avatar switches to loaded state when image emits load", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/components/avatar.html");
  const avatar = page.locator("[ng-avatar]").first();
  const fallback = avatar.locator(".avatar-fallback");

  await expect(avatar).toHaveAttribute("data-state", "loaded");
  await expect(fallback).toBeHidden();
});

test("avatar normalizes default and authored sizes", async ({ page }) => {
  await page.goto("/docs/static/examples/components/avatar-workflows.html");
  const avatars = page.locator('[aria-label="Avatar sizes"] [ng-avatar]');

  await expect(avatars.nth(0)).toHaveAttribute("data-size", "sm");
  await expect(avatars.nth(1)).toHaveAttribute("data-size", "default");
  await expect(avatars.nth(2)).toHaveAttribute("data-size", "lg");
});
