import { expect, test } from "@playwright/test";

const canonicalUrl = "/src/components/range-slider/range-slider.html";
const workflowsUrl =
  "/docs/static/examples/components/range-slider-workflows.html";

test("canonical range slider coordinates native thumbs", async ({ page }) => {
  await page.goto(canonicalUrl);

  const root = page.getByLabel("Price range");
  const minimum = page.getByLabel("Minimum price");
  await expect(root).toHaveCSS("--range-start", "25%");
  await expect(root).toHaveCSS("--range-end", "75%");

  await minimum.fill("40");
  await expect(root).toHaveCSS("--range-start", "40%");
  await expect(page.locator("output")).toHaveText("40-75");
});

test("composite sliders aggregate controlled and range thumb geometry", async ({
  page,
}) => {
  await page.goto(workflowsUrl);

  const controlled = page.getByLabel("Temperature range");
  const minimumTemperature = page.getByRole("slider", {
    name: "Minimum temperature",
  });
  const maximumTemperature = page.getByRole("slider", {
    name: "Maximum temperature",
  });
  await expect(minimumTemperature).toHaveValue("0.3");
  await expect(maximumTemperature).toHaveValue("0.7");
  await expect(controlled).toHaveCSS("--range-start", "30%");
  await expect(controlled).toHaveCSS("--range-end", "70%");
  await expect(minimumTemperature).toHaveAttribute("min", "0");
  await expect(minimumTemperature).toHaveAttribute("max", "1");
  await expect(maximumTemperature).toHaveAttribute("min", "0");
  await expect(maximumTemperature).toHaveAttribute("max", "1");

  await minimumTemperature.fill("0.5");
  await expect(minimumTemperature).toHaveValue("0.5");
  await expect(maximumTemperature).toHaveValue("0.7");
  await expect(controlled).toHaveCSS("--range-start", "50%");
  await expect(
    page.locator("#slider-controlled-title").locator("..").locator("output"),
  ).toContainText("0.5, 0.7");

  await minimumTemperature.press("ArrowRight");
  await expect(minimumTemperature).toHaveValue("0.6");
  await expect(minimumTemperature).toHaveValue("0.6");

  const range = page.getByLabel("Price range");
  const maximumPrice = page.getByRole("slider", { name: "Maximum price" });
  await maximumPrice.fill("80");
  await expect(maximumPrice).toHaveValue("80");
  await expect(range).toHaveCSS("--range-start", "25%");
  await expect(range).toHaveCSS("--range-end", "80%");
});

test("multiple slider retains three native thumbs on shared absolute bounds", async ({
  page,
}) => {
  await page.goto(workflowsUrl);

  const multiple = page.getByLabel("Multiple slider values");
  const thumbs = multiple.getByRole("slider");
  await expect(thumbs).toHaveCount(3);
  expect(
    await thumbs.evaluateAll((inputs: HTMLInputElement[]) =>
      inputs.map((input) => input.value),
    ),
  ).toEqual(["10", "20", "70"]);
  await expect(multiple).toHaveCSS("--range-start", "10%");
  await expect(multiple).toHaveCSS("--range-end", "70%");

  const second = page.getByRole("slider", { name: "Second value" });
  await second.fill("50");
  expect(
    await thumbs.evaluateAll((inputs: HTMLInputElement[]) =>
      inputs.map((input) => input.value),
    ),
  ).toEqual(["10", "50", "70"]);
  for (const thumb of await thumbs.all()) {
    await expect(thumb).toHaveAttribute("min", "0");
    await expect(thumb).toHaveAttribute("max", "100");
  }
});

test("RTL and vertical sliders preserve native direction and orientation", async ({
  page,
}) => {
  await page.goto(workflowsUrl);

  const rtl = page.getByRole("slider", { name: "مستوى الصوت" });
  await expect(rtl).not.toHaveAttribute("ng-range-slider");
  await expect(rtl).not.toHaveAttribute("aria-orientation");
  await expect(rtl).toHaveValue("75");
  await rtl.fill("60");
  await expect(
    page.locator("#slider-rtl-title").locator("..").locator("output"),
  ).toHaveText("60");

  const vertical = page.getByRole("slider", { name: /vertical value/ });
  await expect(vertical).toHaveCount(2);
  for (const thumb of await vertical.all()) {
    await expect(thumb).not.toHaveAttribute("ng-range-slider");
    await expect(thumb).toHaveAttribute("orientation", "vertical");
    const box = await thumb.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeCloseTo(160, 0);
    expect(box!.width).toBeCloseTo(20, 0);
  }
  await vertical.nth(1).fill("40");
  await expect(vertical.nth(1)).toHaveValue("40");
});
