import { expect, test } from "@playwright/test";

test("aspect-ratio writes CSS ratio from attributes", async ({ page }) => {
  await page.goto("/docs/static/examples/components/aspect-ratio.html");

  const element = page.locator("[ng-aspect-ratio]");
  await expect(element).not.toHaveAttribute("data-slot");
  await expect(element).toHaveAttribute("data-ratio", "16 / 9");
  await expect(element).toHaveAttribute("style", /--ratio:\s*16 \/ 9/);
});
