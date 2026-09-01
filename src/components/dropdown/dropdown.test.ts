import { expect, test } from "@playwright/test";

const canonicalUrl = "/docs/static/examples/components/dropdown.html";
const workflowsUrl = "/docs/static/examples/components/dropdown-workflows.html";

test("canonical dropdown exposes semantic state and closes from selection or Escape", async ({
  page,
}) => {
  await page.goto(canonicalUrl);

  const root = page.locator("[ng-dropdown]");
  const trigger = page.getByRole("button", { name: "Options" });
  const menu = page.getByRole("menu");

  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(menu).toHaveAttribute("data-open", "false");
  await expect(menu).toHaveAttribute(
    "aria-labelledby",
    (await trigger.getAttribute("id")) ?? "",
  );
  await expect(menu.getByRole("menuitem")).not.toHaveCount(0);

  await trigger.click();
  await expect(root).toHaveAttribute("data-state", "open");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(menu).toHaveAttribute("data-open", "true");

  await menu.getByRole("menuitem", { name: /New task/ }).click();
  await expect(menu).toHaveAttribute("data-open", "false");
  await expect(trigger).toBeFocused();

  await trigger.click();
  await page.keyboard.press("Escape");
  await expect(menu).toHaveAttribute("data-open", "false");
  await expect(trigger).toBeFocused();
});

test("canonical dropdown reflects external authored open state", async ({
  page,
}) => {
  await page.goto(canonicalUrl);

  const root = page.locator("[ng-dropdown]");
  const trigger = page.getByRole("button", { name: "Options" });
  const menu = page.getByRole("menu");

  await root.evaluate((element) => element.setAttribute("data-open", "true"));
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(trigger).toHaveAttribute("data-state", "open");
  await expect(menu).toHaveAttribute("data-state", "open");

  await root.evaluate((element) => element.setAttribute("data-open", "false"));
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toHaveAttribute("data-state", "closed");
  await expect(menu).toHaveAttribute("data-state", "closed");
});

test("workflow HTML supplies dynamic items and AngularTS preference state", async ({
  page,
}) => {
  await page.goto(workflowsUrl);

  const account = page.getByLabel("Account commands");
  await page.getByRole("button", { name: "Add archive item" }).click();
  const archive = account.getByRole("menuitem", { name: "Archive" });
  await expect(archive).toBeAttached();
  await expect(archive).toHaveAttribute("role", "menuitem");
  await account.getByRole("button", { name: "Open" }).click();
  await archive.click();
  await expect(account.getByRole("menu")).toHaveAttribute("data-open", "false");

  const preferences = page.locator("#dropdown-preferences-title").locator("..");
  const preferencesTrigger = preferences.getByRole("button", {
    name: "Notifications",
  });
  await preferencesTrigger.click();
  const sms = preferences.getByRole("menuitemcheckbox", {
    name: "SMS notifications",
  });
  await expect(sms).toHaveAttribute("aria-checked", "false");
  await sms.click();
  await preferencesTrigger.click();
  await expect(sms).toHaveAttribute("aria-checked", "true");
  await preferences.getByRole("menuitemradio", { name: "Top" }).click();
  await preferencesTrigger.click();
  await expect(
    preferences.getByRole("menuitemradio", { name: "Top" }),
  ).toHaveAttribute("aria-checked", "true");
});

test("workflow HTML preserves icon triggers and submenu keyboard behavior", async ({
  page,
}) => {
  await page.goto(workflowsUrl);

  const avatarTrigger = page.getByRole("button", {
    name: "Open account menu",
  });
  await expect(avatarTrigger.locator(":scope > svg")).toHaveCount(0);
  await expect(avatarTrigger.locator(".avatar")).toBeVisible();
  await avatarTrigger.click();
  await expect(
    page.locator(".dropdown-avatar-demo").getByRole("menu"),
  ).toHaveAttribute("data-open", "true");
  await page.keyboard.press("Escape");

  const actions = page.locator("#dropdown-actions-title").locator("..");
  await actions.getByRole("button", { name: "Actions" }).click();
  const subTrigger = actions.getByRole("menuitem", { name: "Invite users" });
  await subTrigger.focus();
  await subTrigger.press("ArrowRight");
  const subContent = actions.locator(".dropdown-menu-sub-content");
  await expect(subContent).toHaveAttribute("data-state", "open");
  await expect(actions.getByRole("menuitem", { name: "Email" })).toBeFocused();
  await page.keyboard.press("ArrowLeft");
  await expect(subContent).toHaveAttribute("data-state", "closed");
});

test("workflow HTML mirrors RTL direction and AngularTS disabled state", async ({
  page,
}) => {
  await page.goto(workflowsUrl);

  const root = page.getByLabel("Arabic account menu");
  const trigger = root.getByRole("button", { name: "افتح القائمة" });
  const menu = root.getByRole("menu");
  const disabled = page.getByRole("checkbox", { name: "تعطيل القائمة" });

  await expect(root).toHaveAttribute("data-direction", "rtl");
  await expect(menu).toHaveAttribute("data-direction", "rtl");
  await expect(root).toHaveAttribute("data-disabled", "false");

  await disabled.check();
  await expect(trigger).toBeDisabled();
  await expect(trigger).toHaveAttribute("aria-disabled", "true");
  await expect(root).toHaveAttribute("data-disabled", "true");
  await trigger.click({ force: true });
  await expect(menu).toHaveAttribute("data-open", "false");

  await disabled.uncheck();
  await trigger.click();
  await expect(menu).toHaveAttribute("data-open", "true");
});
