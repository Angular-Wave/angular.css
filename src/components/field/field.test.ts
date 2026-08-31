import { expect, test } from "@playwright/test";

const statesUrl = "/docs/static/examples/components/field-state-workflows.html";

test("field links visible descriptions and errors to its control", async ({
  page,
}) => {
  await page.goto(statesUrl);

  const control = page.locator("#message-control");
  await expect(page.locator("#message-field")).toHaveAttribute("role", "group");
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

test("field mirrors an authored invalid state", async ({ page }) => {
  await page.goto(statesUrl);

  await expect(page.locator("#explicit-invalid-field")).toHaveAttribute(
    "data-invalid",
    "true",
  );
});

test("field mirrors native required validity", async ({ page }) => {
  await page.goto(statesUrl);

  const field = page.locator("#required-field");
  const input = page.locator("#required-email");
  await expect(field).toHaveAttribute("data-invalid", "true");
  await expect(input).toHaveAttribute("aria-invalid", "true");

  await input.fill("jane@example.com");
  await expect(field).toHaveAttribute("data-invalid", "false");
  await expect(input).toHaveAttribute("aria-invalid", "false");
});

test("field tracks a control inserted by an AngularTS structural binding", async ({
  page,
}) => {
  await page.goto(statesUrl);

  const field = page.locator("#dynamic-field");
  const input = page.locator("#dynamic-email");
  await expect(input).toHaveCount(0);
  await page.getByRole("button", { name: "Add email field" }).click();

  await expect(input).toBeVisible();
  await expect(field).toHaveAttribute("data-invalid", "true");
  await expect(input).toHaveAttribute("aria-describedby", /field-message-\d+/);

  await input.fill("team@example.com");
  await expect(field).toHaveAttribute("data-invalid", "false");
});

test("field workflows compose controls, responsive layout, and RTL", async ({
  page,
}) => {
  await page.setViewportSize({ height: 2500, width: 1100 });
  await page.goto("/docs/static/examples/components/field-workflows.html");

  await expect(page.locator("[data-example]")).toHaveCount(13);
  const fields = page.locator("[ng-field]");
  expect(await fields.count()).toBeGreaterThan(20);
  for (const field of await fields.all()) {
    await expect(field).toHaveAttribute("role", "group");
  }

  await page.getByLabel("External disks").check();
  await expect(page.getByLabel("External disks")).toBeChecked();
  await page.getByLabel("Multi-factor authentication").check();
  await expect(page.getByLabel("Multi-factor authentication")).toBeChecked();
  await page.getByLabel("Yearly ($99.99/year)").check();
  await expect(page.getByLabel("Yearly ($99.99/year)")).toBeChecked();
  await page.getByLabel("Minimum budget").fill("300");
  await expect(
    page.locator(
      "[data-example='field-slider'] [data-slot='field-description']",
    ),
  ).toContainText("$300 - $800");

  const select = page.locator("[data-example='field-select']");
  await select.locator("[ng-select-trigger]").click();
  await select.getByRole("option", { name: "Engineering" }).click();
  await expect(select.locator("[ng-select-value]")).toHaveText("Engineering");

  const responsive = page.locator(
    "[data-example='field-responsive']",
  );
  await responsive.getByLabel("Name").fill("Jane Doe");
  await responsive.getByRole("button", { name: "Submit" }).click();
  await expect(page.locator(".field-workflow-output")).toHaveText(
    "Profile submitted Jane Doe",
  );
  await expect(
    page.locator("[data-example='field-rtl']"),
  ).toHaveAttribute("dir", "rtl");

  await page.mouse.move(1090, 2490);
  await expect(page.locator(".field-workflow-grid")).toHaveScreenshot(
    "field-workflows-desktop.png",
    { animations: "disabled" },
  );
});
