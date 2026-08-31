import { expect, test, type Locator } from "@playwright/test";

const canonicalUrl = "/docs/static/examples/components/chart.html";
const workflowsUrl = "/docs/static/examples/components/chart-workflows.html";
const compositionsUrl =
  "/docs/static/examples/components/chart-compositions.html";

const customProperty = (locator: Locator, property: string) =>
  locator.evaluate((element: HTMLElement, name: string) => {
    return element.style.getPropertyValue(name).trim();
  }, property) as Promise<string>;

test("canonical chart exposes all grouped bars with semantic values", async ({
  page,
}) => {
  await page.goto(canonicalUrl);

  const chart = page.locator("[ng-chart]");
  const groups = page.locator(
    `:is([data-slot=chart-bar-group], [ng-chart-bar-group])`,
  );
  const bars = page.locator(`:is([data-slot=chart-bar], [ng-chart-bar])`);

  await expect(page.locator("body")).toHaveAttribute(
    "data-example",
    "chart-example",
  );
  await expect(chart).toHaveAttribute("role", "img");
  await expect(chart).toHaveAttribute(
    "aria-label",
    "Desktop and mobile visitors from January through June",
  );
  await expect(groups).toHaveCount(6);
  await expect(bars).toHaveCount(12);
  await expect(bars.first()).toHaveAttribute("role", "img");
  await expect(bars.first()).toHaveAttribute(
    "aria-label",
    "January desktop: 61%",
  );
  await expect(bars.first()).toHaveCSS("--value", "61%");
  expect(await customProperty(bars.first(), "--chart-color")).toBe("#2563eb");
});

test("workflow charts expose grid, axis, legend, and live tooltip anatomy", async ({
  page,
}) => {
  await page.goto(workflowsUrl);

  const charts = page.locator("[ng-chart]");
  await expect(charts).toHaveCount(4);
  await expect(
    page.locator(`:is([data-slot=chart-grid], [ng-chart-grid])`),
  ).toHaveCount(4);
  await expect(
    page.locator(`:is([data-slot=chart-axis], [ng-chart-axis])`),
  ).toHaveCount(3);
  await expect(
    page.locator(`:is([data-slot=chart-legend], [ng-chart-legend])`),
  ).toHaveCount(1);
  await expect(
    page.locator(`:is([data-slot=chart-grid], [ng-chart-grid])`).first(),
  ).toHaveAttribute("aria-hidden", "true");
  await expect(
    page.locator(`:is([data-slot=chart-axis], [ng-chart-axis])`).first(),
  ).toHaveAttribute("role", "list");
  await expect(
    page
      .locator(`:is([data-slot=chart-axis-item], [ng-chart-axis-item])`)
      .first(),
  ).toHaveAttribute("role", "listitem");
  await expect(
    page.locator(`:is([data-slot=chart-legend], [ng-chart-legend])`),
  ).toHaveAttribute("role", "list");

  const tooltipWorkflow = page.locator(
    "[aria-labelledby='chart-tooltip-heading']",
  );
  const firstGroup = tooltipWorkflow
    .locator(`:is([data-slot=chart-bar-group], [ng-chart-bar-group])`)
    .first();
  await firstGroup.hover();
  const tooltip = tooltipWorkflow.locator(
    `:is([data-slot=chart-tooltip], [ng-chart-tooltip])`,
  );
  await expect(tooltip).toBeVisible();
  await expect(tooltip).toHaveAttribute("role", "status");
  await expect(tooltip).toHaveAttribute("data-visible", "true");
  await expect(tooltip).toContainText("January");
  await expect(tooltip).toContainText("Desktop186");
  await expect(
    tooltip.locator(
      `:is([data-slot=chart-tooltip-items], [ng-chart-tooltip-items])`,
    ),
  ).toHaveAttribute("role", "list");
  await expect(
    tooltip.locator(
      `:is([data-slot=chart-tooltip-item], [ng-chart-tooltip-item])`,
    ),
  ).toHaveCount(2);
  await expect(
    tooltip
      .locator(
        `:is([data-slot=chart-tooltip-indicator], [ng-chart-tooltip-indicator])`,
      )
      .first(),
  ).toHaveAttribute("aria-hidden", "true");
  await page.mouse.move(0, 0);
  await expect(tooltip).toHaveCount(0);
});

test("interactive chart keeps series state in AngularTS and mirrors it to bars", async ({
  page,
}) => {
  await page.goto(compositionsUrl);

  const controls = page.locator(".chart-series-controls > button");
  const bars = page.locator(
    `.chart-daily-bars :is([data-slot=chart-bar], [ng-chart-bar])`,
  );
  await expect(bars).toHaveCount(30);
  await expect(controls.nth(0)).toHaveAttribute("data-active", "true");
  await expect(controls.nth(1)).toHaveAttribute("data-active", "false");
  await expect(bars.first()).toHaveAttribute("data-value", "49%");
  await expect(bars.first()).toHaveCSS("--value", "49%");

  await controls.nth(1).click();
  await expect(controls.nth(0)).toHaveAttribute("data-active", "false");
  await expect(controls.nth(1)).toHaveAttribute("data-active", "true");
  await expect(bars.first()).toHaveAttribute("data-value", "36%");
  await expect(bars.first()).toHaveCSS("--value", "36%");
  await expect(bars.first()).toHaveAttribute("aria-label", "Apr 1 mobile: 36%");
  expect(await customProperty(bars.first(), "--chart-color")).toBe(
    "var(--chart-1)",
  );

  await bars.first().hover();
  const tooltip = page.locator(
    ".chart-interactive-demo :is([data-slot=chart-tooltip], [ng-chart-tooltip])",
  );
  await expect(tooltip).toHaveAttribute("role", "status");
  await expect(tooltip).toContainText("Apr 1, 2024");
  await expect(tooltip).toContainText("Mobile150");
});

test("RTL and tooltip compositions receive complete chart semantics", async ({
  page,
}) => {
  await page.goto(compositionsUrl);

  const rtl = page.locator('.chart-composition[dir="rtl"] [ng-chart]');
  await expect(rtl).toHaveAttribute("data-direction", "rtl");
  await expect(
    rtl.locator(`:is([data-slot=chart-bar-group], [ng-chart-bar-group])`),
  ).toHaveCount(6);
  await expect(
    rtl.locator(`:is([data-slot=chart-axis-item], [ng-chart-axis-item])`),
  ).toHaveCount(6);
  await expect(
    rtl.locator(`:is([data-slot=chart-legend-item], [ng-chart-legend-item])`),
  ).toHaveCount(2);

  await rtl
    .locator(`:is([data-slot=chart-bar-group], [ng-chart-bar-group])`)
    .first()
    .hover();
  await expect(
    rtl.locator(`:is([data-slot=chart-tooltip], [ng-chart-tooltip])`),
  ).toContainText("يناير");

  const gallery = page.locator(".chart-tooltip-gallery");
  const tooltips = gallery.locator(
    `:is([data-slot=chart-tooltip], [ng-chart-tooltip])`,
  );
  await expect(gallery).toHaveAttribute("role", "img");
  await expect(tooltips).toHaveCount(4);
  for (const tooltip of await tooltips.all()) {
    await expect(tooltip).toHaveAttribute("role", "status");
    await expect(tooltip).toHaveAttribute("data-visible", "true");
  }
  await expect(gallery.locator(`[data-indicator="dashed"]`)).toHaveCount(2);
  await expect(gallery.locator(`[data-indicator="line"]`)).toHaveCount(1);
  expect(
    await customProperty(
      gallery
        .locator(
          `:is([data-slot=chart-tooltip-indicator], [ng-chart-tooltip-indicator])`,
        )
        .nth(1),
      "--chart-color",
    ),
  ).toBe("var(--chart-2)");
});

test("published chart responds to authored node and direction changes", async ({
  page,
}) => {
  await page.goto(canonicalUrl);

  const chart = page.locator("[ng-chart]");
  const firstBar = chart
    .locator(`:is([data-slot=chart-bar], [ng-chart-bar])`)
    .first();
  await firstBar.evaluate((element) => {
    element.setAttribute("data-value", "80%");
    element.setAttribute("data-color", "var(--chart-4)");
  });
  await expect(firstBar).toHaveCSS("--value", "80%");
  expect(await customProperty(firstBar, "--chart-color")).toBe(
    "var(--chart-4)",
  );

  await chart.evaluate((element) => element.setAttribute("dir", "rtl"));
  await expect(chart).toHaveAttribute("data-direction", "rtl");
  await firstBar.evaluate((element) => {
    element.removeAttribute("data-value");
    element.removeAttribute("data-color");
  });
  expect(await customProperty(firstBar, "--value")).toBe("");
  expect(await customProperty(firstBar, "--chart-color")).toBe("");
});
