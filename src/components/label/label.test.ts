import { expect, test } from "@playwright/test";

test("label tracks associated control state", async ({ page }) => {
  await page.goto("/docs/static/examples/components/label.html");
  const label = page.locator('[ng-label][for="email"]');
  await page.locator("#email").evaluate((input) => {
    input.setAttribute("required", "");
    input.setAttribute("disabled", "");
  });

  await expect(label).toHaveAttribute("data-associated", "true");
  await expect(label).toHaveAttribute("data-required", "true");
  await expect(label).toHaveAttribute("data-disabled", "true");
});

test("label handles missing controls as unassociated", async ({ page }) => {
  await page.goto("/docs/static/examples/components/label.html");
  const label = page.locator('[ng-label][for="email"]');
  await page.locator("#email").evaluate((input) => input.remove());

  await expect(label).toHaveAttribute("data-associated", "false");
  await expect(label).toHaveAttribute("data-required", "false");
  await expect(label).toHaveAttribute("data-disabled", "false");
});

test("label reacts to control attribute updates", async ({ page }) => {
  await page.goto("/docs/static/examples/components/label.html");

  const label = page.locator('[ng-label][for="email"]');
  await expect(label).toHaveAttribute("data-associated", "true");
  await expect(label).toHaveAttribute("data-required", "false");
  await expect(label).toHaveAttribute("data-disabled", "false");

  await page.locator("#email").evaluate((input) => {
    input.setAttribute("required", "");
    input.setAttribute("disabled", "");
  });

  await expect(label).toHaveAttribute("data-required", "true");
  await expect(label).toHaveAttribute("data-disabled", "true");
});

test("label tracks nested controls inserted after link", async ({ page }) => {
  await page.goto("/docs/static/examples/components/label.html");
  const label = page.locator("[ng-label]").first();
  await page.evaluate(() => {
    const input = document.querySelector("#email");
    const state = window as typeof window & { labelControl?: Element };
    state.labelControl = input ?? undefined;
    input?.remove();
  });
  await expect(label).toHaveAttribute("data-associated", "false");

  await label.evaluate((element) => {
    const state = window as typeof window & { labelControl?: Element };
    element.removeAttribute("for");
    state.labelControl?.setAttribute("required", "");
    if (state.labelControl) element.append(state.labelControl);
  });

  await expect(label).toHaveAttribute("data-associated", "true");
  await expect(label).toHaveAttribute("data-required", "true");
});

test("label tracks for-based controls inserted after link", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/components/label.html");
  const label = page.locator('[ng-label][for="email"]');
  await page.evaluate(() => {
    const input = document.querySelector("#email");
    const state = window as typeof window & { labelControl?: Element };
    state.labelControl = input ?? undefined;
    input?.remove();
  });
  await expect(label).toHaveAttribute("data-associated", "false");

  await label.evaluate((element) => {
    const state = window as typeof window & { labelControl?: Element };
    state.labelControl?.setAttribute("disabled", "");
    if (state.labelControl) element.parentElement?.append(state.labelControl);
  });

  await expect(label).toHaveAttribute("data-associated", "true");
  await expect(label).toHaveAttribute("data-disabled", "true");
});

test("label reference examples activate LTR and RTL native controls", async ({
  page,
}) => {
  await page.setViewportSize({ height: 420, width: 820 });
  await page.goto("/docs/static/examples/components/label.html");

  await page.getByLabel("Accept terms and conditions").check();
  await page.getByLabel("قبول الشروط والأحكام").check();
  await expect(page.getByRole("status")).toContainText("Terms: accepted");
  await expect(page.getByRole("status")).toContainText("الشروط: مقبولة");
  await expect(page.locator(".label-workflows")).toHaveScreenshot(
    "label-workflows-desktop.png",
    { animations: "disabled" },
  );
});
