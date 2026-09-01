import { expect, test } from "@playwright/test";

test("element entrypoint example is a complete functional chart page", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/elements/chart.html");

  const chart = page.locator(".chart");
  const bars = chart.locator(`.chart-bar`);

  expect(await chart.getAttribute("role")).toBeNull();
  await expect(chart).toHaveRole("figure");
  await expect(bars).toHaveCount(12);
  await expect(bars.first()).toHaveAttribute("data-value", "61%");
});
