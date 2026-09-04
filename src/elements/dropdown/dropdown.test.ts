import { expect, test } from "@playwright/test";

test("dropdown element example exercises the built functional artifact", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/elements/dropdown.html");

  const trigger = page.getByRole("button", { name: "Options" });
  const menu = page.getByRole("menu");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(menu).toBeVisible();
  await menu.getByRole("menuitem", { name: /Edit task/ }).click();
  await expect(menu).toBeHidden();
  await expect(trigger).toBeFocused();
});
