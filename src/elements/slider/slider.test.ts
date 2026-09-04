import { expect, test } from "@playwright/test";

test("slider element example exercises native state through the built artifact", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/elements/slider.html");

  const slider = page.locator("#volume");
  await expect(slider).toHaveAttribute("ng-slider", "");
  await slider.fill("35");
  await expect(page.locator('output[for="volume"]')).toHaveText("35");
  await expect(slider).toHaveValue("35");
  await expect(slider).toHaveCSS("--value", "35%");
});
