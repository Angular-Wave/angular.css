import { expect, test } from "@playwright/test";

const canonicalUrl = "/docs/static/examples/components/slider.html";
const workflowsUrl = "/docs/static/examples/components/slider-workflows.html";

test("canonical native sliders mirror AngularTS model and disabled state", async ({
  page,
}) => {
  await page.goto(canonicalUrl);

  const slider = page.locator("#volume");
  const disabled = page.locator("#volume-disabled");
  await expect(slider).toHaveAttribute("role", "slider");
  await expect(slider).toHaveAttribute("aria-valuemin", "0");
  await expect(slider).toHaveAttribute("aria-valuemax", "100");
  await expect(slider).toHaveAttribute("aria-valuenow", "75");
  await expect(slider).toHaveAttribute("data-value", "75");
  await expect(slider).toHaveCSS("--value", "75%");

  await slider.fill("42");
  await expect(page.locator('output[for="volume"]')).toHaveText("42");
  await expect(slider).toHaveAttribute("aria-valuenow", "42");
  await expect(slider).toHaveCSS("--value", "42%");

  await expect(disabled).toBeDisabled();
  await expect(disabled).toHaveAttribute("data-disabled", "true");
  await expect(disabled).toHaveAttribute("aria-disabled", "true");
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
  await expect(controlled).toHaveAttribute("data-values", "0.3,0.7");
  await expect(controlled).toHaveCSS("--range-start", "30%");
  await expect(controlled).toHaveCSS("--range-end", "70%");
  await expect(minimumTemperature).toHaveAttribute("min", "0");
  await expect(minimumTemperature).toHaveAttribute("max", "1");
  await expect(maximumTemperature).toHaveAttribute("min", "0");
  await expect(maximumTemperature).toHaveAttribute("max", "1");

  await minimumTemperature.fill("0.5");
  await expect(controlled).toHaveAttribute("data-values", "0.5,0.7");
  await expect(controlled).toHaveCSS("--range-start", "50%");
  await expect(
    page.locator("#slider-controlled-title").locator("..").locator("output"),
  ).toContainText("0.5, 0.7");

  await minimumTemperature.press("ArrowRight");
  await expect(minimumTemperature).toHaveValue("0.6");
  await expect(controlled).toHaveAttribute("data-values", "0.6,0.7");

  const range = page.getByLabel("Price range");
  const maximumPrice = page.getByRole("slider", { name: "Maximum price" });
  await maximumPrice.fill("80");
  await expect(range).toHaveAttribute("data-values", "25,80");
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
  await expect(multiple).toHaveAttribute("data-values", "10,20,70");
  await expect(multiple).toHaveCSS("--range-start", "10%");
  await expect(multiple).toHaveCSS("--range-end", "70%");

  const second = page.getByRole("slider", { name: "Second value" });
  await second.fill("50");
  await expect(multiple).toHaveAttribute("data-values", "10,50,70");
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
  await expect(rtl).toHaveAttribute("aria-orientation", "horizontal");
  await expect(rtl).toHaveAttribute("data-value", "75");
  await rtl.fill("60");
  await expect(
    page.locator("#slider-rtl-title").locator("..").locator("output"),
  ).toHaveText("60");

  const vertical = page.getByRole("slider", { name: /vertical value/ });
  await expect(vertical).toHaveCount(2);
  for (const thumb of await vertical.all()) {
    await expect(thumb).toHaveAttribute("aria-orientation", "vertical");
    const box = await thumb.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeCloseTo(160, 0);
    expect(box!.width).toBeCloseTo(20, 0);
  }
  await vertical.nth(1).fill("40");
  await expect(vertical.nth(1)).toHaveAttribute("aria-valuenow", "40");
  await expect(vertical.nth(1)).toHaveCSS("--value", "40%");
});

test("native slider mirrors dynamic bounds, orientation, and invalid state", async ({
  page,
}) => {
  await page.goto(canonicalUrl);

  const slider = page.locator("#volume");
  await slider.evaluate((element: HTMLInputElement) => {
    element.setAttribute("orientation", "vertical");
    element.min = "5";
    element.max = "15";
    element.value = "15";
    element.setAttribute("aria-invalid", "true");
    element.dispatchEvent(new Event("input", { bubbles: true }));
  });

  await expect(slider).toHaveAttribute("aria-orientation", "vertical");
  await expect(slider).toHaveAttribute("data-orientation", "vertical");
  await expect(slider).toHaveAttribute("aria-valuemin", "5");
  await expect(slider).toHaveAttribute("aria-valuemax", "15");
  await expect(slider).toHaveAttribute("aria-valuenow", "15");
  await expect(slider).toHaveAttribute("data-invalid", "true");
  await expect(slider).toHaveCSS("--value", "100%");
});
