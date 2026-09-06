import { expect, test } from "@playwright/test";

import { testStyleOnlyElement } from "../../testing/style-only-element";

testStyleOnlyElement({
  category: "patterns",
  directive: "ngBadge",
  name: "badge",
  selector: ".badge",
});

test("custom badges derive a readable foreground with an explicit fallback", async ({
  page,
}) => {
  await page.goto("/src/patterns/badge/badge.html");
  const badge = page.locator('.badge[variant="custom"]');

  await expect(badge).toBeVisible();
  await expect(badge).not.toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(badge).not.toHaveCSS("color", "rgba(0, 0, 0, 0)");
});
