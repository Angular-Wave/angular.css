import { expect, test } from "@playwright/test";

test("tree manages hierarchical focus, expansion, and selection", async ({
  page,
}) => {
  await page.goto("/src/components/tree/tree.html");
  const tree = page.getByRole("tree", { name: "Organization" });
  const items = tree.locator('[role="treeitem"]');
  const operations = tree.locator('[role="treeitem"][data-value="operations"]');
  const finance = tree.locator('[role="treeitem"][data-value="finance"]');

  await expect(items).toHaveCount(7);
  expect(
    await items.evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("aria-selected")),
    ),
  ).toEqual(Array(7).fill("false"));
  await expect(operations).toHaveAttribute("tabindex", "0");
  await operations.focus();
  await operations.press("ArrowDown");
  await expect(
    tree.locator('[role="treeitem"][data-value="fulfillment"]'),
  ).toBeFocused();
  await page.keyboard.press("End");
  await expect(finance).toBeFocused();
  await finance.press("ArrowRight");
  await expect(finance).toHaveAttribute("aria-expanded", "true");
  await finance.press("ArrowRight");
  await expect(
    tree.locator('[role="treeitem"][data-value="accounts"]'),
  ).toBeFocused();
  await page.keyboard.press("ArrowLeft");
  await expect(finance).toBeFocused();
  await page.keyboard.press(" ");
  await expect(finance).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("output")).toContainText("finance");

  const operationsChildren = operations.locator(":scope > ul");
  await operationsChildren.evaluate((group) => {
    group.setAttribute("hidden", "");
  });
  await operations.focus();
  await operations.press("ArrowDown");
  await expect(finance).toBeFocused();
});

test("tree mirrors hierarchy keys in RTL", async ({ page }) => {
  await page.goto("/src/components/tree/tree.html");
  const tree = page.getByRole("tree", { name: "Organization" });
  await tree.evaluate((element) => element.setAttribute("dir", "rtl"));
  const finance = tree.locator('[data-value="finance"]');

  await finance.focus();
  await finance.press("ArrowLeft");
  await expect(finance).toHaveAttribute("aria-expanded", "true");
  await finance.press("ArrowLeft");
  await expect(tree.locator('[data-value="accounts"]')).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(finance).toBeFocused();
});

test("tree incorporates dynamic nodes into typeahead navigation", async ({
  page,
}) => {
  await page.goto("/src/components/tree/tree.html");
  const tree = page.getByRole("tree", { name: "Organization" });
  const operations = tree.locator('[data-value="operations"]');

  await tree.evaluate((element) => {
    const item = document.createElement("li");
    item.dataset.value = "warehouse";
    const label = document.createElement("span");
    label.textContent = "Warehouse";
    item.append(label);
    element.append(item);
  });

  const warehouse = tree.locator('[data-value="warehouse"]');
  await expect(warehouse).toHaveAttribute("role", "treeitem");
  await operations.focus();
  await operations.press("w");
  await expect(warehouse).toBeFocused();
});
