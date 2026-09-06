import { expect, test } from "@playwright/test";

const canonicalUrl = "/src/patterns/toggle-group/toggle-group.html";
const workflowsUrl =
  "/docs/static/examples/components/toggle-group-workflows.html";

test("native radio toggle group owns single selection and AngularTS state", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  const radios = page.getByRole("radio");

  await expect(radios).toHaveCount(3);
  await expect(page.getByRole("radio", { name: "Center" })).toBeChecked();
  await page.getByRole("radio", { name: "Right" }).check();
  await expect(page.getByRole("radio", { name: "Right" })).toBeChecked();
  await expect(page.getByRole("radio", { name: "Center" })).not.toBeChecked();
  await expect(page.locator(".output")).toContainText("Alignment: right");
});

test("native checkbox toggle group owns independent multiple selection", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  const group = page.locator("#multiple-toggle-group");
  const bold = group.getByRole("checkbox", { name: "Bold" });
  const underline = group.getByRole("checkbox", { name: "Underline" });

  await expect(bold).toBeChecked();
  await underline.check();
  await bold.uncheck();
  await expect(bold).not.toBeChecked();
  await expect(underline).toBeChecked();
});

test("native radio navigation skips disabled controls", async ({ page }) => {
  await page.goto(workflowsUrl);
  const group = page.locator("#keyboard-toggle-group");
  const bold = group.getByRole("radio", { name: "Bold" });
  const italic = group.getByRole("radio", { name: "Italic" });
  const underline = group.getByRole("radio", { name: "Underline" });

  await expect(italic).toBeDisabled();
  await bold.focus();
  await bold.press("ArrowRight");
  await expect(underline).toBeFocused();
  await expect(underline).toBeChecked();
});

test("native fieldset disables every toggle", async ({ page }) => {
  await page.goto(workflowsUrl);
  const controls = page.locator("#disabled-toggle-group input");

  await expect(controls).toHaveCount(3);
  for (const control of await controls.all())
    await expect(control).toBeDisabled();
});

test("authored orientation, spacing, and direction remain CSS and AngularTS state", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  const vertical = page.locator("#vertical-toggle-group");
  const rtl = page.locator("#rtl-toggle-group");

  await expect(vertical).toHaveCSS("flex-direction", "column");
  await expect(vertical).toHaveCSS("gap", "4px");
  await expect(rtl).toHaveCSS("direction", "rtl");
  await page.getByRole("button", { name: "Change direction" }).click();
  await expect(rtl).toHaveCSS("direction", "ltr");

  await page.getByRole("radio", { name: "Aa Bold" }).check();
  await expect(page.locator(".output")).toContainText("font-bold");
});
