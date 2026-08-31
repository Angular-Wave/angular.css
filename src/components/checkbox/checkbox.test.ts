import { expect, test } from "@playwright/test";

const canonicalUrl = "/docs/static/examples/components/checkbox.html";
const workflowsUrl = "/docs/static/examples/components/checkbox-workflows.html";
const compositionsUrl =
  "/docs/static/examples/components/checkbox-compositions.html";

test("canonical checkbox demo preserves native and AngularTS state", async ({
  page,
}) => {
  await page.goto(canonicalUrl);

  const checkboxes = page.locator("[ng-checkbox]");
  const terms = page.locator("#terms-checkbox");
  const described = page.locator("#terms-checkbox-2");
  const disabled = page.locator("#toggle-checkbox");

  await expect(page.locator("body")).toHaveAttribute(
    "data-example",
    "checkbox-demo",
  );
  await expect(checkboxes).toHaveCount(4);
  await expect(terms).toHaveAttribute("data-state", "unchecked");
  await expect(terms).toHaveAttribute("aria-checked", "false");
  await expect(described).toBeChecked();
  await expect(described).toHaveAttribute("data-state", "checked");
  await expect(described).toHaveAttribute("aria-describedby", /field-message-/);
  await expect(disabled).toBeDisabled();
  await expect(disabled).toHaveAttribute("data-disabled", "true");

  await terms.check();
  await expect(terms).toHaveAttribute("data-state", "checked");
  await expect(terms).toHaveAttribute("aria-checked", "true");
  await expect(page.getByRole("status")).toContainText("Terms accepted");
  expect(
    await terms.evaluate(
      (element) => getComputedStyle(element, "::after").display,
    ),
  ).toBe("block");
});

test("checkbox workflows cover basic, description, disabled, invalid, group, and RTL", async ({
  page,
}) => {
  await page.goto(workflowsUrl);

  await expect(page.locator("body")).toHaveAttribute(
    "data-example",
    "checkbox-basic checkbox-description checkbox-disabled checkbox-group checkbox-invalid checkbox-rtl",
  );
  await expect(page.locator("[ng-checkbox]")).toHaveCount(12);
  await expect(page.locator("#terms-checkbox-basic")).not.toBeChecked();
  await expect(page.locator("#terms-checkbox-desc")).toBeChecked();
  await expect(page.locator("#toggle-checkbox-disabled")).toBeDisabled();
  await expect(page.locator("#terms-checkbox-invalid")).toHaveAttribute(
    "data-invalid",
    "true",
  );
  const invalidColors = await page
    .locator("#terms-checkbox-invalid")
    .evaluate((element) => {
      const probe = document.createElement("span");
      probe.style.color = "var(--error)";
      document.body.append(probe);
      const result = {
        border: getComputedStyle(element).borderColor,
        token: getComputedStyle(probe).color,
      };
      probe.remove();
      return result;
    });
  expect(invalidColors.border).toBe(invalidColors.token);

  await expect(page.locator("#hard-disks")).toBeChecked();
  await expect(page.locator("#external-disks")).toBeChecked();
  await page.locator("#cds-dvds").check();
  await expect(page.getByRole("status")).toContainText("CDs true");

  const rtl = page.locator(".checkbox-workflow-rtl");
  await expect(rtl).toHaveAttribute("dir", "rtl");
  await expect(rtl.locator("[ng-checkbox]")).toHaveCount(4);
  const field = rtl.locator(`:is([data-slot=field], [ng-field])`).first();
  const controlBox = await field.locator("[ng-checkbox]").boundingBox();
  const labelBox = await field.locator("label").boundingBox();
  expect(controlBox).not.toBeNull();
  expect(labelBox).not.toBeNull();
  expect(controlBox!.x).toBeGreaterThan(labelBox!.x);
});

test("checkbox table selection remains application-owned AngularTS state", async ({
  page,
}) => {
  await page.goto(compositionsUrl);

  const table = page.getByRole("table", { name: "Team members" });
  const rows = table.locator("tbody tr");
  const selectAll = page.getByRole("checkbox", { name: "Select all rows" });

  await expect(table).toHaveAttribute("data-row-count", "4");
  await expect(table).toHaveAttribute("data-column-count", "4");
  await expect(rows).toHaveCount(4);
  await expect(rows.nth(0)).toHaveAttribute("data-state", "selected");
  await expect(rows.nth(1)).toHaveAttribute("data-state", "");

  await selectAll.check();
  await expect(rows.locator("[ng-checkbox]:checked")).toHaveCount(4);
  for (const row of await rows.all()) {
    await expect(row).toHaveAttribute("data-state", "selected");
  }

  await page
    .getByRole("checkbox", { name: "Select Marcus Rodriguez" })
    .uncheck();
  await expect(selectAll).not.toBeChecked();
  await expect(rows.nth(1)).toHaveAttribute("data-state", "");
  await expect(page.getByRole("status")).toContainText(
    "Marcus Rodriguez not selected",
  );
});

test("checkbox mirrors native indeterminate, required, and disabled state", async ({
  page,
}) => {
  await page.goto(canonicalUrl);

  const checkbox = page.locator("#terms-checkbox");
  await checkbox.evaluate((element: HTMLInputElement) => {
    element.indeterminate = true;
    element.required = true;
    element.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await expect(checkbox).toHaveAttribute("data-state", "indeterminate");
  await expect(checkbox).toHaveAttribute("aria-checked", "mixed");
  await expect(checkbox).toHaveAttribute("data-required", "true");
  await expect(checkbox).toHaveAttribute("aria-required", "true");

  await checkbox.evaluate((element: HTMLInputElement) => {
    element.indeterminate = false;
    element.required = false;
    element.disabled = true;
    element.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await expect(checkbox).toHaveAttribute("data-state", "unchecked");
  await expect(checkbox).toHaveAttribute("aria-checked", "false");
  await expect(checkbox).toHaveAttribute("data-disabled", "true");
  await expect(checkbox).toHaveAttribute("aria-disabled", "true");
});
