import { expect, test } from "@playwright/test";

test("element entrypoint example is a complete functional chart page", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/elements/chart.html");

  const chart = page.locator("[ng-chart]");
  const bars = chart.locator(`:is([data-slot=chart-bar], [ng-chart-bar])`);

  await expect(chart).toHaveAttribute("role", "img");
  await expect(chart).toHaveAttribute("data-direction", "ltr");
  await expect(bars).toHaveCount(12);
  await expect(bars.first()).toHaveAttribute(
    "aria-label",
    "January desktop: 61%",
  );
  await expect(bars.first()).toHaveCSS("--value", "61%");
});
