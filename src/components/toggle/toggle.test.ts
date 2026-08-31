import { expect, test } from "@playwright/test";

test("published toggle mirrors AngularTS pressed state", async ({ page }) => {
  await page.goto("/docs/static/examples/components/toggle.html");

  const toggle = page.getByRole("button", { name: "Toggle bold" });
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await expect(toggle).toHaveAttribute("data-state", "on");
  await expect(page.locator(".output")).toContainText("Bold: on");
});

test("published workflow follows AngularTS disabled state without owning aria-disabled", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/components/toggle-workflows.html");
  const toggles = page.getByRole("button", { name: "Disabled", exact: true });

  await expect(toggles).toHaveCount(2);
  await expect(toggles.first()).toBeDisabled();
  await expect(toggles.first()).toHaveAttribute("data-disabled", "true");
  await expect(toggles.first()).not.toHaveAttribute("aria-disabled");

  await page.getByRole("button", { name: "Enable toggles" }).click();
  await expect(toggles.first()).toBeEnabled();
  await expect(toggles.first()).toHaveAttribute("data-disabled", "false");
  await expect(toggles.first()).not.toHaveAttribute("aria-disabled");
});

test("published RTL toggle remains interactive", async ({ page }) => {
  await page.goto("/docs/static/examples/components/toggle-workflows.html");
  const toggle = page.getByRole("button", {
    name: "تبديل الإشارة المرجعية",
  });

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await expect(toggle).toHaveAttribute("data-state", "on");
  await expect(page.getByRole("status")).toContainText("مفعلة");
});
