import { expect, test, type Page } from "@playwright/test";

const canonicalUrl = "/docs/static/examples/components/radio-group.html";
const fieldsUrl = "/docs/static/examples/components/radio-fields.html";

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

test("radio-group directive mirrors selected radio states", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  await expectBuiltArtifactRuntime(page);

  const radios = page.locator("[ng-radio-group] input[type='radio']");
  await expect(page.locator("[ng-radio-group]")).toHaveAttribute(
    "role",
    "radiogroup",
  );
  await expect(radios.nth(0)).toHaveAttribute("role", "radio");
  await expect(radios.nth(1)).toBeChecked();
  await expect(radios.nth(1)).toHaveAttribute("data-state", "checked");
  await expect(radios.nth(1)).toHaveAttribute("aria-checked", "true");
  await radios.nth(2).check();
  await expect(radios.nth(0)).toHaveAttribute("data-state", "unchecked");
  await expect(radios.nth(2)).toHaveAttribute("data-state", "checked");
  await expect(radios.nth(2)).toHaveAttribute("aria-checked", "true");
});

test("radio-group directive mirrors native arrow navigation", async ({
  page,
}) => {
  await page.goto(canonicalUrl);

  const radios = page.locator("[ng-radio-group] input[type='radio']");
  await radios.nth(0).check();
  await radios.nth(1).evaluate((radio) => {
    radio.setAttribute("disabled", "");
  });
  await radios.nth(0).focus();
  await radios.nth(0).press("ArrowRight");

  await expect(radios.nth(2)).toBeChecked();
  await expect(radios.nth(2)).toBeFocused();
  await expect(radios.nth(2)).toHaveAttribute("data-state", "checked");
});

test("radio-group directive binds radios inserted after link", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  const group = page.locator("[ng-radio-group]");
  const radios = group.locator("input[type='radio']");
  const compact = page.locator("#density-compact");
  await compact.evaluate((radio) => {
    const group = radio.closest("[ng-radio-group]");
    radio.remove();
    group?.append(radio);
  });

  await expect(compact).toHaveAttribute("role", "radio");
  await expect(compact).toHaveAttribute("data-state", "unchecked");

  await compact.check();
  await expect(radios.nth(0)).toHaveAttribute("data-state", "unchecked");
  await expect(compact).toHaveAttribute("data-state", "checked");
  await expect(compact).toHaveAttribute("aria-checked", "true");
});

test("radio fields preserve native composition and AngularTS model ownership", async ({
  page,
}) => {
  await page.goto(fieldsUrl);
  await expectBuiltArtifactRuntime(page);

  const groups = page.getByRole("radiogroup");
  const radios = page.getByRole("radio");
  const fieldsets = page.locator("fieldset[ng-field-set]");
  await expect(groups).toHaveCount(6);
  await expect(radios).toHaveCount(14);
  await expect(fieldsets).toHaveCount(4);
  await expect(page.locator("#radio-free")).toBeChecked();
  await expect(page.locator("#radio-free")).toHaveAttribute(
    "data-state",
    "checked",
  );

  const battery = page.getByRole("radiogroup", { name: "Battery Level" });
  await battery.getByRole("radio", { name: "Medium" }).check();
  await expect(page.locator("#battery-medium")).toBeChecked();
  await expect(page.locator("#battery-medium")).toHaveAttribute(
    "data-state",
    "checked",
  );
  await expect(page.locator("#battery-high")).toHaveAttribute(
    "data-state",
    "unchecked",
  );

  const titleCard = page.locator('label[ng-field-label][for="radio-title-1"]');
  await expect(titleCard).toHaveCSS("border-top-style", "solid");
  await expect(titleCard.locator(":scope > [ng-field]")).toHaveCSS(
    "padding-top",
    "10px",
  );
  await page.locator("#radio-title-1").check();
  await expect(page.locator("#radio-title-1")).toHaveAttribute(
    "data-state",
    "checked",
  );
  await expect(titleCard).not.toHaveCSS("background-color", "rgba(0, 0, 0, 0)");

  const invalid = page.locator('[name="invalid-choice"]');
  const disabled = page.locator('[name="disabled-choice"]');
  await expect(invalid).toHaveCount(2);
  await expect(disabled).toHaveCount(2);
  for (const radio of await invalid.all()) {
    await expect(radio).toHaveAttribute("aria-invalid", "true");
  }
  for (const radio of await disabled.all()) {
    await expect(radio).toBeDisabled();
  }
  await expect(
    page.getByRole("radiogroup", { name: "Disabled Radio Group" }),
  ).toHaveAttribute("aria-disabled", "true");
});
