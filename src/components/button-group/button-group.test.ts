import { expect, test } from "@playwright/test";

const canonicalUrl = "/docs/static/examples/components/button-group.html";

test("published button group normalizes group and separator orientation", async ({
  page,
}) => {
  await page.goto(canonicalUrl);

  const group = page.getByRole("group", { name: "Media controls" });
  const separator = group.locator('[data-slot="button-group-separator"]');
  await expect(group).toHaveAttribute("data-orientation", "vertical");
  await expect(separator).toHaveAttribute("role", "separator");
  await expect(separator).toHaveAttribute("data-orientation", "horizontal");
  await expect(separator).toHaveAttribute("aria-orientation", "horizontal");
});

test("published button group preserves application-owned button state and focus", async ({
  page,
}) => {
  await page.goto(canonicalUrl);

  const unmanaged = page.locator("#button-group-unmanaged");
  const managed = page.locator("#button-group-managed");
  await expect(unmanaged).not.toHaveAttribute("aria-pressed");
  await expect(unmanaged).not.toHaveAttribute("tabindex");
  await expect(managed).toHaveAttribute("aria-pressed", "true");
  await expect(managed).toHaveAttribute("tabindex", "3");

  await unmanaged.focus();
  await unmanaged.press("ArrowRight");
  await expect(unmanaged).toBeFocused();
});
