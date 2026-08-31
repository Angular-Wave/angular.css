import { expect, test, type Locator, type Page } from "@playwright/test";

const canonicalUrl = "/docs/static/examples/components/progress.html";
const workflowsUrl = "/docs/static/examples/components/progress-workflows.html";

const expectBuiltArtifactRuntime = async (page: Page): Promise<void> => {
  await expect(
    page.locator('script[src="../../js/angular-ts.umd.js"]'),
  ).toHaveCount(1);
  await expect(
    page.locator('script[src="../../js/angular-css.umd.js"]'),
  ).toHaveCount(1);

  const sourceRequests = await page.evaluate(() =>
    performance
      .getEntriesByType("resource")
      .map((entry) => entry.name)
      .filter((url) => /\/src\/(?:components|elements)\/.*\.ts$/.test(url)),
  );
  expect(sourceRequests).toEqual([]);
};

const indicatorRatio = async (progress: Locator): Promise<number> =>
  progress.evaluate((element) => {
    const track = element.querySelector<HTMLElement>(
      '[data-slot="progress-track"]',
    );
    const indicator = element.querySelector<HTMLElement>(
      '[data-slot="progress-indicator"]',
    );
    if (!track || !indicator) return 0;
    return (
      indicator.getBoundingClientRect().width /
      track.getBoundingClientRect().width
    );
  });

test("canonical progress synchronizes timed and labeled built artifacts", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  await expectBuiltArtifactRuntime(page);

  const timed = page.locator(".progress-demo-timed");
  await expect(timed).toHaveAttribute("role", "progressbar");
  await expect(timed).toHaveAttribute("aria-valuemin", "0");
  await expect(timed).toHaveAttribute("aria-valuemax", "100");
  await expect(timed).toHaveAttribute("aria-valuenow", "66");
  await expect(timed).toHaveAttribute("data-value", "66");
  await expect.poll(() => indicatorRatio(timed)).toBeCloseTo(0.66, 2);
  await expect(timed.locator('[data-slot="progress-track"]')).toHaveCSS(
    "height",
    "4px",
  );

  const labeled = page.locator(".progress-demo-labeled");
  const label = labeled.locator('[data-slot="progress-label"]');
  await expect(labeled.locator('[data-slot="progress-value"]')).toHaveText(
    "56%",
  );
  await expect(label).toHaveAttribute("id", /progress-label-\d+/);
  await expect(labeled).toHaveAttribute(
    "aria-labelledby",
    (await label.getAttribute("id")) ?? "",
  );
});

test("controlled workflow leaves the value model with AngularTS and native input", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  await expectBuiltArtifactRuntime(page);

  const progress = page.getByRole("progressbar", { name: "Controlled" });
  const slider = page.getByRole("slider", { name: "Progress value" });
  await slider.fill("83");

  await expect(progress).toHaveAttribute("value", "83");
  await expect(progress).toHaveAttribute("aria-valuenow", "83");
  await expect(progress).toHaveAttribute("data-value", "83");
  await expect(page.locator(".progress-workflows output")).toHaveText("83%");
  await expect.poll(() => indicatorRatio(progress)).toBeCloseTo(0.83, 2);
});

test("authored max, clamped value, and indeterminate state stay synchronized", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  const progress = page.getByRole("progressbar", { name: "Controlled" });

  await progress.evaluate((element) => {
    element.setAttribute("max", "80");
    element.setAttribute("value", "120");
  });
  await expect(progress).toHaveAttribute("aria-valuemax", "80");
  await expect(progress).toHaveAttribute("aria-valuenow", "80");
  await expect(progress).toHaveAttribute("data-value", "80");
  await expect.poll(() => indicatorRatio(progress)).toBeCloseTo(1, 2);

  await progress.evaluate((element) => element.removeAttribute("value"));
  await expect(progress).not.toHaveAttribute("aria-valuenow");
  await expect(progress).not.toHaveAttribute("data-value");
  await expect.poll(() => indicatorRatio(progress)).toBeCloseTo(0, 2);
});

test("RTL progress preserves localized text and anchors the indicator inline-start", async ({
  page,
}) => {
  await page.goto(workflowsUrl);

  const progress = page.getByRole("progressbar", { name: "تقدم الرفع" });
  const label = progress.locator('[data-slot="progress-label"]');
  const value = progress.locator('[data-slot="progress-value"]');
  await expect(progress).toHaveAttribute("dir", "rtl");
  await expect(value).toHaveText("٥٦%");
  await expect(progress).toHaveAttribute(
    "aria-labelledby",
    (await label.getAttribute("id")) ?? "",
  );

  const geometry = await progress.evaluate((element) => {
    const track = element.querySelector<HTMLElement>(
      '[data-slot="progress-track"]',
    )!;
    const indicator = element.querySelector<HTMLElement>(
      '[data-slot="progress-indicator"]',
    )!;
    const trackRect = track.getBoundingClientRect();
    const indicatorRect = indicator.getBoundingClientRect();
    return {
      indicatorRight: indicatorRect.right,
      labelX: element
        .querySelector<HTMLElement>('[data-slot="progress-label"]')!
        .getBoundingClientRect().x,
      trackRight: trackRect.right,
      valueX: element
        .querySelector<HTMLElement>('[data-slot="progress-value"]')!
        .getBoundingClientRect().x,
    };
  });
  expect(geometry.indicatorRight).toBeCloseTo(geometry.trackRight, 0);
  expect(geometry.valueX).toBeLessThan(geometry.labelX);
});
