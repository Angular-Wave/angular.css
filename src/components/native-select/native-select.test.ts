import { expect, test, type Page } from "@playwright/test";

const canonicalUrl = "/docs/static/examples/components/native-select.html";
const workflowsUrl =
  "/docs/static/examples/components/native-select-workflows.html";
const rtlUrl = "/docs/static/examples/components/native-select-rtl.html";

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

test("canonical native select uses built bundles and Nova geometry", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  await expectBuiltArtifactRuntime(page);

  const wrapper = page.locator('[data-slot="native-select-wrapper"]');
  const select = page.getByRole("combobox", { name: "Status" });
  const icon = page.locator('[data-slot="native-select-icon"]');
  await expect(select).toHaveAttribute("data-empty", "true");
  await expect(select).toHaveAttribute("data-value", "");
  await expect(select.locator("option")).toHaveCount(5);
  await expect(icon).toHaveAttribute("aria-hidden", "true");

  const [wrapperBox, selectBox, iconBox] = await Promise.all([
    wrapper.boundingBox(),
    select.boundingBox(),
    icon.boundingBox(),
  ]);
  expect(wrapperBox).not.toBeNull();
  expect(selectBox).not.toBeNull();
  expect(iconBox).not.toBeNull();
  expect(wrapperBox!.height).toBeCloseTo(32, 0);
  expect(selectBox!.height).toBeCloseTo(32, 0);
  expect(iconBox!.x).toBeGreaterThan(selectBox!.x + selectBox!.width / 2);
  await expect(select).toHaveCSS("border-radius", "10px");
  await expect(select).toHaveCSS("box-shadow", "none");
});

test("native selection remains model-owned and mirrors stable state hooks", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  const select = page.getByRole("combobox", { name: "Status" });

  await select.selectOption("done");
  await expect(select).toHaveValue("done");
  await expect(select).toHaveAttribute("data-value", "done");
  await expect(select).toHaveAttribute("data-empty", "false");

  await select.selectOption("");
  await expect(select).toHaveValue("");
  await expect(select).toHaveAttribute("data-value", "");
  await expect(select).toHaveAttribute("data-empty", "true");
});

test("grouped workflow options update AngularTS model output", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  await expectBuiltArtifactRuntime(page);

  const department = page.getByRole("combobox", { name: "Department" });
  await expect(department.locator("optgroup")).toHaveCount(3);
  await expect(
    department.locator('optgroup[label="Engineering"] option'),
  ).toHaveCount(3);
  await expect(
    department.locator('optgroup[label="Sales"] option'),
  ).toHaveCount(3);
  await expect(
    department.locator('optgroup[label="Operations"] option'),
  ).toHaveCount(3);

  await department.selectOption("product-manager");
  await expect(department).toHaveValue("product-manager");
  await expect(page.locator("#native-department-output")).toHaveText(
    "product-manager",
  );
  await expect(department).toHaveAttribute("data-value", "product-manager");
});

test("disabled, invalid, and small states retain native semantics and Nova sizing", async ({
  page,
}) => {
  await page.goto(workflowsUrl);

  const disabled = page.getByRole("combobox", { name: "Disabled" });
  const invalid = page.getByRole("combobox", { name: "Invalid" });
  const small = page.getByRole("combobox", { name: "Small" });
  await expect(disabled).toBeDisabled();
  await expect(disabled).toHaveAttribute("data-disabled", "true");
  await expect(disabled).toHaveAttribute("aria-disabled", "true");
  await expect(disabled.locator("..")).toHaveCSS("opacity", "0.5");

  await expect(invalid).toHaveAttribute("aria-invalid", "true");
  await expect(invalid).toHaveAttribute("data-invalid", "true");
  const invalidColors = await invalid.evaluate((element) => {
    const probe = document.createElement("div");
    probe.style.color = "var(--error)";
    document.body.append(probe);
    const border = getComputedStyle(element).borderTopColor;
    const token = getComputedStyle(probe).color;
    probe.remove();
    return { border, token };
  });
  expect(invalidColors.border).toBe(invalidColors.token);

  await expect(small).toHaveAttribute("data-size", "sm");
  expect((await small.boundingBox())!.height).toBeCloseTo(28, 0);
});

test("dynamic AngularTS option insertion is observed without test construction", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  const select = page.getByRole("combobox", { name: "Project status" });
  await expect(select.locator('option[value="archived"]')).toHaveCount(0);

  await page.getByRole("button", { name: "Add archived option" }).click();
  await expect(select.locator('option[value="archived"]')).toHaveCount(1);
  await select.selectOption("archived");
  await expect(select).toHaveValue("archived");
  await expect(select).toHaveAttribute("data-value", "archived");
  await expect(page.locator("#native-dynamic-output")).toHaveText("archived");
});

test("RTL keeps native direction and moves the icon to the inline end", async ({
  page,
}) => {
  await page.goto(rtlUrl);
  await expectBuiltArtifactRuntime(page);

  const select = page.getByRole("combobox", { name: "الحالة" });
  const icon = page.locator('[data-slot="native-select-icon"]');
  await expect(select).toHaveCSS("direction", "rtl");
  const [selectBox, iconBox] = await Promise.all([
    select.boundingBox(),
    icon.boundingBox(),
  ]);
  expect(selectBox).not.toBeNull();
  expect(iconBox).not.toBeNull();
  expect(iconBox!.x + iconBox!.width).toBeLessThan(
    selectBox!.x + selectBox!.width / 2,
  );

  await select.selectOption("done");
  await expect(page.locator("#rtl-native-output")).toHaveText("done");
  await expect(select).toHaveAttribute("data-value", "done");
});
