import { expect, test } from "@playwright/test";

test("avatar leaves image and fallback ownership in authored HTML", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/components/avatar.html");
  const imageAvatar = page.locator(".avatar").first();
  const fallbackAvatar = page.locator('.avatar[aria-label="Jane Doe"]');

  await expect(imageAvatar.locator("img")).toBeVisible();
  await expect(imageAvatar).not.toHaveAttribute("data-state", /.+/);
  await expect(fallbackAvatar.locator(":scope > span")).toHaveText("JD");
  await expect(fallbackAvatar.locator("img")).toHaveCount(0);
});

test("avatar sizes are authored CSS options without runtime normalization", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/components/avatar-workflows.html");
  const avatars = page.locator('[aria-label="Avatar sizes"] .avatar');

  await expect(avatars.nth(0)).toHaveAttribute("size", "sm");
  await expect(avatars.nth(0)).toHaveCSS("width", "24px");
  await expect(avatars.nth(1)).toHaveCSS("width", "32px");
  await expect(avatars.nth(2)).toHaveAttribute("size", "lg");
  await expect(avatars.nth(2)).toHaveCSS("width", "40px");
});
