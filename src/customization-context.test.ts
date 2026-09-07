import { expect, test } from "@playwright/test";

test("density contexts coordinate spacing and control geometry", async ({
  page,
}) => {
  await page.goto("/src/recipes/data-table/data-table.html");
  const root = page.locator(".data-table");
  const search = page.getByRole("searchbox", { name: "Search orders" });
  const sort = page.getByRole("button", { name: "Order" });

  await expect(search).toHaveCSS("height", "36px");
  await expect(sort).toHaveCSS("height", "36px");

  await root.evaluate((element) =>
    element.setAttribute("data-density", "compact"),
  );
  await expect(search).toHaveCSS("height", "32px");
  await expect(sort).toHaveCSS("height", "32px");

  await root.evaluate((element) =>
    element.setAttribute("data-density", "comfortable"),
  );
  await expect(search).toHaveCSS("height", "40px");
  await expect(sort).toHaveCSS("height", "40px");
});

test("contrast and print contexts share semantic behavior", async ({
  page,
}) => {
  await page.goto("/src/recipes/data-table/data-table.html");
  const root = page.locator(".data-table");

  await root.evaluate((element) => {
    element.setAttribute("data-contrast", "more");
    element.insertAdjacentHTML(
      "beforeend",
      '<p data-print="exclude">Screen controls</p><p data-print="only">Printed record</p>',
    );
  });
  await expect(root).toHaveCSS("--ring", "#1c2024");
  await expect(page.locator('[data-print="exclude"]')).toBeVisible();
  await expect(page.locator('[data-print="only"]')).toBeHidden();

  await page.emulateMedia({ media: "print" });
  await expect(page.locator('[data-print="exclude"]')).toBeHidden();
  await expect(page.locator('[data-print="only"]')).toBeVisible();
  await expect(root.locator("figure")).toHaveCSS("overflow", "visible");
  await expect(root).toHaveCSS("--shadow-md", "none");
});
