import { readFileSync } from "node:fs";

import { expect, test } from "@playwright/test";

const budgets = JSON.parse(
  readFileSync("performance-budgets.json", "utf8"),
) as {
  runtime: {
    maximumInteractionBatchMs: number;
    maximumPageLoadMs: number;
  };
};

const representativeExamples = [
  "application-shell",
  "combobox",
  "command",
  "data-table",
] as const;

test("representative enterprise examples stay within the page-load budget", async ({
  page,
}) => {
  for (const example of representativeExamples) {
    await page.goto("/docs/static/examples/components/" + example + ".html");
    await page.waitForLoadState("load");

    const duration = await page.evaluate(() => {
      const [navigation] = performance.getEntriesByType(
        "navigation",
      ) as PerformanceNavigationTiming[];
      return navigation.loadEventEnd - navigation.startTime;
    });

    expect(
      duration,
      `${example} load duration exceeded the runtime budget`,
    ).toBeLessThan(budgets.runtime.maximumPageLoadMs);
  }
});

test("backend-style filtering stays within the interaction batch budget", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/components/data-table.html");

  const duration = await page
    .locator('input[type="search"]')
    .evaluate((input) => {
      const control = input as HTMLInputElement;
      const started = performance.now();
      for (let index = 0; index < 100; index += 1) {
        control.value = index % 2 === 0 ? "Grace" : "";
        control.dispatchEvent(new Event("input", { bubbles: true }));
      }
      return performance.now() - started;
    });

  expect(duration).toBeLessThan(budgets.runtime.maximumInteractionBatchMs);
});
