import { expect, test } from "@playwright/test";

test("select element example uses native selection", async ({ page }) => {
  await page.goto("/docs/static/examples/elements/select.html");

  const select = page.getByRole("combobox", { name: "Fruit" });
  await expect(select).toHaveValue("");
  await select.selectOption({ label: "Pineapple" });
  await expect(select).toHaveValue("pineapple");
  await expect(page.locator(".output")).toContainText("Selected: pineapple");
});
