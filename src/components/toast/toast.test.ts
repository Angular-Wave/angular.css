import { expect, test } from "@playwright/test";

const canonicalUrl = "/src/components/toast/toast.html";
const workflowsUrl = "/docs/static/examples/components/toast-workflows.html";
const toastSelector = ":scope > article";

test("canonical Toast demo creates accessible toast feedback from built HTML", async ({
  page,
}) => {
  await page.goto(canonicalUrl);

  const toaster = page.locator("[ng-toast]");
  const toast = toaster.locator(toastSelector);
  await expect(toaster).toHaveAttribute("position", "bottom-right");
  await expect(toast).toHaveCount(0);

  await page.getByRole("button", { name: "Show Toast" }).click();
  await expect(toast).toHaveCount(1);
  await expect(toast).toHaveAttribute("animate", "");
  await expect(toast).toHaveAttribute("role", "status");
  await expect(toast).toHaveAttribute("aria-live", "polite");
  await expect(toast).toHaveAttribute("aria-atomic", "true");
  await expect(toast).toHaveAttribute("type", "default");

  const title = toast.getByRole("heading");
  const description = toast.locator("p");
  await expect(toast).toHaveAttribute(
    "aria-labelledby",
    (await title.getAttribute("id")) ?? "",
  );
  await expect(toast).toHaveAttribute(
    "aria-describedby",
    (await description.getAttribute("id")) ?? "",
  );

  const action = page.getByRole("button", { name: "Undo" });
  await expect(action).toHaveAttribute("type", "button");
  await action.click();
  await expect(toast).toHaveCount(0);
  await expect(page.locator(".output")).toHaveText("Undo selected");

  await page.getByRole("button", { name: "Show Toast" }).click();
  await expect(toast).toHaveCount(1);
});

test("description workflow inserts repeatable toasts and closes through built behavior", async ({
  page,
}) => {
  await page.goto(workflowsUrl);

  const toaster = page.getByLabel("Description notifications");
  const toast = toaster.locator(toastSelector);
  await expect(toast).toHaveCount(0);

  await page.getByRole("button", { name: "Show Toast", exact: true }).click();
  await expect(toast).toHaveCount(1);
  await expect(toast).toHaveAttribute("aria-labelledby", /toast-title-/);
  await expect(toast).toHaveAttribute("aria-describedby", /toast-description-/);

  const close = page.getByRole("button", {
    name: "Dismiss description toast",
  });
  await expect(close).toHaveAttribute("type", "button");
  await close.click();
  await expect(toast).toHaveCount(0);
  await expect(
    page.locator(".toast-workflow-section").first().locator(".output"),
  ).toHaveText("Toast dismissed");

  await page.getByRole("button", { name: "Show Toast", exact: true }).click();
  await expect(toast).toHaveCount(1);
});

test("position workflow reflects all authored placements and fallback state", async ({
  page,
}) => {
  await page.goto(workflowsUrl);

  const toaster = page.getByLabel("Position notifications");
  const toast = toaster.locator(toastSelector);
  await expect(toaster).toHaveAttribute("position", "bottom-right");

  await page.getByRole("button", { name: "Top Left" }).click();
  await expect(toaster).toHaveAttribute("position", "top-left");
  await expect(toast).toHaveCount(1);

  await page.getByRole("button", { name: "Bottom Center" }).click();
  await expect(toaster).toHaveAttribute("position", "bottom-center");
  await expect(
    page.locator("#toast-position-title").locator("..").locator(".output"),
  ).toContainText("bottom-center");

  await toaster.evaluate((element) => {
    element.setAttribute("position", "unsupported");
  });
  await expect(toaster).toHaveAttribute("position", "bottom-right");
});

test("type workflow reflects default, rich, and promise transition states", async ({
  page,
}) => {
  await page.goto(workflowsUrl);

  const toaster = page.getByLabel("Type notifications");
  const toast = toaster.locator(toastSelector);
  const typeButtons = page.getByLabel("Toast types");

  for (const type of ["Default", "Success", "Info", "Warning", "Error"]) {
    await typeButtons.getByRole("button", { name: type }).click();
    await expect(toast).toHaveAttribute("type", type.toLowerCase());
  }

  await typeButtons.getByRole("button", { name: "Promise" }).click();
  await expect(toast).toHaveAttribute("type", "loading");
  await expect(toast).toContainText("Loading...");
  await expect(toast.locator(":scope > figure > svg")).toHaveCount(1);

  await expect(toast).toHaveAttribute("type", "success", {
    timeout: 2_000,
  });
  await expect(toast).toContainText("Event has been created");

  await page.getByRole("button", { name: "Dismiss type toast" }).click();
  await expect(toast).toHaveCount(0);
});
