import { expect, test } from "@playwright/test";

test("input artifact uses native state and AngularTS models without an AngularCSS directive", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/components/input.html");
  await expect(
    page.locator('script[src$="/js/angular-ts.umd.js"]'),
  ).toHaveCount(1);
  await expect(
    page.locator('script[src$="/js/angular-css.umd.js"]'),
  ).toHaveCount(1);

  const inputs = page.locator("input[data-input]");
  await expect(inputs).toHaveCount(4);
  await expect(page.locator("[ng-input]")).toHaveCount(0);
  await expect(inputs.first()).not.toHaveAttribute("data-empty");
  await expect(inputs.first()).not.toHaveAttribute("data-invalid");
  await expect(inputs.first()).not.toHaveAttribute("data-disabled");
  await expect(inputs.first()).not.toHaveAttribute("data-required");

  const search = page.getByLabel("Search");
  await search.fill("semantic");
  await expect(search).toHaveValue("semantic");
  await expect(page.locator(".output")).toHaveText("Value: semantic");

  await expect(page.getByLabel("Disabled")).toBeDisabled();
  const invalid = page.getByLabel("Invalid");
  await expect(invalid).toHaveAttribute("aria-invalid", "true");
  await expect(invalid).toHaveCSS("border-color", "rgb(229, 72, 77)");
});

test("AngularCSS registry excludes AngularTS ngInput ownership", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/components/input.html");
  expect(
    await page.evaluate(() => {
      const runtime = window.angular as typeof window.angular & {
        module: (name: string) => {
          _invokeQueue?: Array<[string, string, [string]]>;
        };
      };
      return (
        runtime
          .module("ui")
          ._invokeQueue?.flatMap((entry) =>
            entry[1] === "directive" ? [entry[2][0]] : [],
          ) ?? []
      );
    }),
  ).not.toContain("ngInput");
});

test("input workflows preserve native states, compositions, forms, and RTL", async ({
  page,
}) => {
  await page.setViewportSize({ height: 1900, width: 1100 });
  await page.goto("/docs/static/examples/components/input-workflows.html");

  await expect(page.locator("[data-example]")).toHaveCount(15);
  const inputs = page.locator(
    "input[data-input]:not([data-slot='input-group-control'])",
  );
  expect(
    await inputs.evaluateAll((elements) =>
      elements.map((element) => element.getBoundingClientRect().height),
    ),
  ).toEqual(Array(await inputs.count()).fill(32));

  await expect(
    page.locator("[data-example='input-disabled'] input"),
  ).toBeDisabled();
  await expect(
    page.locator("[data-example='input-invalid'] input"),
  ).toHaveAttribute("aria-invalid", "true");
  expect(
    await page
      .locator("[data-example='input-required'] input")
      .evaluate((input: HTMLInputElement) => input.checkValidity()),
  ).toBe(false);

  await page.getByLabel("Inline search").fill("semantic inputs");
  await page
    .locator("[data-example='input-inline']")
    .getByRole("button", { name: "Search" })
    .click();
  await expect(page.locator(".input-workflow-output")).toHaveText(
    "Search semantic inputs",
  );

  const fieldGroup = page.locator(
    "[data-example='input-fieldgroup']",
  );
  await fieldGroup.getByLabel("Name").fill("Jordan Lee");
  await fieldGroup.getByRole("button", { name: "Submit" }).click();
  await expect(page.locator(".input-workflow-output")).toHaveText(
    "Submitted Jordan Lee",
  );
  await expect(
    page.locator("[data-example='input-rtl']"),
  ).toHaveAttribute("dir", "rtl");

  await page.mouse.move(1090, 1890);
  await expect(page.locator(".input-workflow-grid")).toHaveScreenshot(
    "input-workflows-desktop.png",
    { animations: "disabled" },
  );
});
