import { expect, test } from "@playwright/test";

test("button writes data state from variant and size", async ({ page }) => {
  await page.goto("/docs/static/examples/components/button-workflows.html");

  const button = page.locator('[ng-button][size="lg"]');
  await expect(button).toHaveAttribute("data-variant", "outline");
  await expect(button).toHaveAttribute("data-size", "lg");
});

test("button defaults submitless buttons to type button", async ({ page }) => {
  await page.goto("/docs/static/examples/components/button.html");

  await expect(page.locator("[ng-button]").first()).toHaveAttribute(
    "type",
    "button",
  );
});

test("button preserves explicit button type", async ({ page }) => {
  await page.goto("/docs/static/examples/components/button-workflows.html");

  await expect(
    page.getByRole("button", { name: "Get Started" }),
  ).toHaveAttribute("type", "submit");
});

test("button marks disabled state from native disabled attribute", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/components/button-workflows.html");
  await expect(
    page.getByRole("button", { name: "Generating" }),
  ).toHaveAttribute("data-disabled", "true");
});

test("button mirrors aria-disabled into data-disabled", async ({ page }) => {
  await page.goto("/docs/static/examples/components/button-workflows.html");
  const button = page.getByRole("button", { name: "Downloading" });
  await expect(button).toHaveAttribute("aria-disabled", "true");
  await expect(button).toHaveAttribute("data-disabled", "true");
});

test("button styles semantic links without replacing navigation", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/components/button-workflows.html");

  const link = page.getByRole("link", { name: "Login" });
  await expect(link).toHaveAttribute("href", "#login");
  await expect(link).toHaveAttribute("data-variant", "secondary");
  await expect(link).toHaveAttribute("data-size", "sm");
  await expect(link).not.toHaveAttribute("role", "button");
});
