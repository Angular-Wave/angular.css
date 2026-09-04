import { expect, test } from "@playwright/test";

import { testStyleOnlyElement } from "../../testing/style-only-element";

testStyleOnlyElement({
  directive: "ngBadge",
  name: "badge",
  selector: ".badge",
});

test("custom badges derive a readable foreground with an explicit fallback", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/components/badge.html");
  const badge = page.locator('.badge[variant="custom"]');

  await expect(badge).toBeVisible();
  await expect(badge).not.toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(badge).not.toHaveCSS("color", "rgba(0, 0, 0, 0)");
});
