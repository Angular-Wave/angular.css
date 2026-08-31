import { expect, test } from "@playwright/test";

test("element entrypoint example is a functional checkbox page", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/elements/checkbox.html");

  const checkboxes = page.locator("[ng-checkbox]");
  const terms = page.locator("#terms-checkbox");
  await expect(checkboxes).toHaveCount(4);
  await expect(terms).toHaveAttribute("data-state", "unchecked");

  await terms.check();
  await expect(terms).toHaveAttribute("data-state", "checked");
  await expect(terms).toHaveAttribute("aria-checked", "true");
  await expect(page.getByRole("status")).toContainText("Terms accepted");
});
