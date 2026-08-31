import { expect, test } from "@playwright/test";

const exampleUrl = "/docs/static/examples/components/direction.html";

test("direction resolves authored and document directions", async ({
  page,
}) => {
  await page.goto(exampleUrl);

  const manual = page.locator("#direction-rtl");
  const fallback = page.locator("#direction-default");
  await expect(manual).toHaveAttribute("data-direction", "rtl");
  await expect(fallback).toHaveAttribute("data-direction", "ltr");
  await expect(manual).toHaveCSS("direction", "rtl");
  await expect(fallback).toHaveCSS("direction", "ltr");
});

test("direction inherits from its nearest authored ancestor", async ({
  page,
}) => {
  await page.goto(exampleUrl);

  const outer = page.locator("#direction-rtl");
  const nested = page.locator("#direction-nested");
  await expect(outer).toHaveAttribute("dir", "rtl");
  await expect(nested).toHaveAttribute("data-direction", "rtl");
  await expect(nested).toHaveAttribute("dir", "rtl");
  await expect(nested).toHaveCSS("direction", "rtl");
});
