import { expect, test } from "@playwright/test";

test("empty supplies polite status semantics to the published state", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/components/empty.html");

  const empty = page.locator("[ng-empty]");
  await expect(empty).toHaveAttribute("role", "status");
  await expect(empty).toHaveAttribute("aria-live", "polite");
  await expect(
    page.getByRole("button", { name: "Create Project" }),
  ).toBeVisible();
});

test("empty workflows preserve reference compositions, interaction, and RTL", async ({
  page,
}) => {
  await page.setViewportSize({ height: 1700, width: 1100 });
  await page.goto("/docs/static/examples/components/empty-workflows.html");

  const workflows = page.locator("[ng-empty]");
  await expect(workflows).toHaveCount(7);
  for (const workflow of await workflows.all()) {
    await expect(workflow).toHaveAttribute("role", "status");
    await expect(workflow).toHaveAttribute("aria-live", "polite");
  }

  await page.getByRole("button", { name: "Leave Message" }).click();
  await expect(page.locator(".empty-workflow-output")).toContainText(
    "Message queued",
  );
  await page.getByLabel("Search missing pages").fill("billing");
  await expect(page.locator(".empty-workflow-output")).toContainText("billing");
  await expect(
    page.locator("[data-example='empty-rtl']"),
  ).toHaveAttribute("dir", "rtl");
  await expect(page.locator(".empty-workflow-grid")).toHaveScreenshot(
    "empty-workflows-desktop.png",
    { animations: "disabled" },
  );
});
