import { expect, test } from "@playwright/test";

import { testStyleOnlyElement } from "../../testing/style-only-element";

testStyleOnlyElement({
  category: "recipes",
  directive: "ngMasterDetail",
  name: "master-detail",
  selector: ".master-detail",
});

test("master detail reuses the Resizable interaction contract", async ({
  page,
}) => {
  await page.goto("/src/recipes/master-detail/master-detail.html");
  const handle = page.getByRole("separator", { name: "Resize customer list" });
  await expect(handle).toHaveAttribute("tabindex", "0");
  await expect(handle).toHaveAttribute("aria-valuenow", "0.75");
});

test("master detail stacks its native sections on narrow screens", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/src/recipes/master-detail/master-detail.html");
  const sections = page.locator(".master-detail > section");
  const handle = page.getByRole("separator", { name: "Resize customer list" });

  await expect(handle).toBeHidden();
  await expect
    .poll(async () => {
      const first = await sections.nth(0).boundingBox();
      const second = await sections.nth(1).boundingBox();
      return first && second
        ? {
            aligned: Math.round(second.x - first.x),
            stacked: second.y >= first.y + first.height,
          }
        : null;
    })
    .toEqual({ aligned: 0, stacked: true });
});
