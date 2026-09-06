import { expect, test } from "@playwright/test";

const statesUrl = "/docs/static/examples/components/field-state-workflows.html";

test("canonical field source binds native controls", async ({ page }) => {
  await page.goto("/src/patterns/field/field.html");

  await page.getByLabel("Name").fill("Ada");
  await expect(page.locator(".output")).toContainText("Ada");
});

test("field keeps authored descriptions and errors connected to its control", async ({
  page,
}) => {
  await page.goto(statesUrl);

  const control = page.locator("#message-control");
  await expect(page.locator("#message-field")).not.toHaveAttribute(
    "role",
    "group",
  );
  const describedBy = (await control.getAttribute("aria-describedby"))?.split(
    /\s+/,
  );

  expect(describedBy).toHaveLength(2);
  await expect(page.locator(`#${describedBy?.[0]}`)).toHaveText(
    "Use your public display name.",
  );
  await expect(page.locator(`#${describedBy?.[1]}`)).toHaveText(
    "The display name is already in use.",
  );
});

test("field styles an authored invalid state without mirroring attributes", async ({
  page,
}) => {
  await page.goto(statesUrl);

  const field = page.locator("#explicit-invalid-field");
  await expect(field.locator("input")).toHaveAttribute("aria-invalid", "true");
  await expect(field.locator("label")).toHaveCSS("color", /rgb\(/);
});

test("field relies on native required validity", async ({ page }) => {
  await page.goto(statesUrl);

  const field = page.locator("#required-field");
  const input = page.locator("#required-email");
  expect(
    await input.evaluate((control: HTMLInputElement) =>
      control.checkValidity(),
    ),
  ).toBe(false);
  await expect(field).not.toHaveAttribute("data-invalid", /.+/);

  await input.fill("jane@example.com");
  expect(
    await input.evaluate((control: HTMLInputElement) =>
      control.checkValidity(),
    ),
  ).toBe(true);
});

test("field supports a control inserted by an AngularTS structural binding", async ({
  page,
}) => {
  await page.goto(statesUrl);

  const input = page.locator("#dynamic-email");
  await expect(input).toHaveCount(0);
  await page.getByRole("button", { name: "Add email field" }).click();

  await expect(input).toBeVisible();
  await expect(input).toHaveAttribute(
    "aria-describedby",
    "dynamic-email-description",
  );
  expect(
    await input.evaluate((control: HTMLInputElement) =>
      control.checkValidity(),
    ),
  ).toBe(false);

  await input.fill("team@example.com");
  expect(
    await input.evaluate((control: HTMLInputElement) =>
      control.checkValidity(),
    ),
  ).toBe(true);
});

test("field workflows compose controls, responsive layout, and RTL", async ({
  page,
}) => {
  await page.setViewportSize({ height: 2500, width: 1100 });
  await page.goto("/docs/static/examples/components/field-workflows.html");

  await expect(page.locator("[data-example]")).toHaveCount(13);
  const fields = page.locator(".field");
  expect(await fields.count()).toBeGreaterThan(20);
  for (const field of await fields.all())
    await expect(field).not.toHaveAttribute("role", "group");

  await page.getByLabel("External disks").check();
  await expect(page.getByLabel("External disks")).toBeChecked();
  await page.getByLabel("Multi-factor authentication").check();
  await expect(page.getByLabel("Multi-factor authentication")).toBeChecked();
  await page.getByLabel("Yearly ($99.99/year)").check();
  await expect(page.getByLabel("Yearly ($99.99/year)")).toBeChecked();
  await page.getByLabel("Minimum budget").fill("300");
  await expect(
    page.locator("[data-example='field-slider'] .field > p"),
  ).toContainText("$300 - $800");

  const select = page.locator("[data-example='field-select']");
  await select.getByRole("combobox").selectOption({ label: "Engineering" });
  await expect(select.getByRole("combobox")).toHaveValue("Engineering");

  const responsive = page.locator("[data-example='field-responsive']");
  await responsive.getByLabel("Name").fill("Jane Doe");
  await responsive.getByRole("button", { name: "Submit" }).click();
  await expect(page.locator(".field-workflow-output")).toHaveText(
    "Profile submitted Jane Doe",
  );
  await expect(page.locator("[data-example='field-rtl']")).toHaveAttribute(
    "dir",
    "rtl",
  );

  await page.mouse.move(1090, 2490);
  await expect(page.locator(".field-workflow-grid")).toHaveScreenshot(
    "field-workflows-desktop.png",
    { animations: "disabled" },
  );
});
