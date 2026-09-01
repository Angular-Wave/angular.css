import { expect, test } from "@playwright/test";

const sourceUrl = "/src/components/select/select.html";

test("source template styles native select and defaults values to option text", async ({
  page,
}) => {
  await page.goto(sourceUrl);

  await expect(
    page.locator('link[href="/docs/static/css/angular.css"]'),
  ).toHaveCount(1);
  await expect(
    page.locator('script[src="/docs/static/js/angular-ts.umd.js"]'),
  ).toHaveCount(1);

  const select = page.getByRole("combobox", { name: "Status" });
  await expect(select).toHaveValue("");
  await expect(select).toHaveCSS("height", "32px");
  await expect(select).toHaveClass(/ng-invalid/);
  await expect(select).toHaveClass(/ng-pristine/);
  await select.selectOption({ label: "Done" });
  await expect(select).toHaveValue("Done");
  await expect(select).toHaveClass(/ng-valid/);
  await expect(select).toHaveClass(/ng-dirty/);
  await expect(page.locator(".output")).toHaveText("Current: Done");
});

test("Select remains styling-only", async ({ page }) => {
  await page.goto(sourceUrl);

  const registeredDirectives = await page.evaluate(() => {
    const runtime = window.angular as unknown as {
      module: (moduleName: string) => {
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
  });
  expect(registeredDirectives).not.toContain("ngSelect");
});
