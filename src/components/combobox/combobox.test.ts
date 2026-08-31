import { expect, test, type Page } from "@playwright/test";

const canonicalUrl = "/docs/static/examples/components/combobox.html";
const workflowsUrl = "/docs/static/examples/components/combobox-workflows.html";
const compositionsUrl =
  "/docs/static/examples/components/combobox-compositions.html";
const statesUrl =
  "/docs/static/examples/components/combobox-state-workflows.html";

const expectBuiltArtifactRuntime = async (page: Page): Promise<void> => {
  await expect(
    page.locator('script[src="../../js/angular-ts.umd.js"]'),
  ).toHaveCount(1);
  await expect(
    page.locator('script[src="../../js/angular-css.umd.js"]'),
  ).toHaveCount(1);
  expect(
    await page.evaluate(() =>
      performance
        .getEntriesByType("resource")
        .map((entry) => entry.name)
        .filter((url) => /\/src\/(?:components|elements)\/.*\.ts$/.test(url)),
    ),
  ).toEqual([]);
};

test("canonical basic and auto-highlight artifacts expose distinct listbox behavior", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  await expectBuiltArtifactRuntime(page);
  const roots = page.locator("[ng-combobox]");
  const basic = page.locator("#basic-combobox");
  const automatic = page.locator("#auto-combobox");
  await expect(roots).toHaveCount(2);
  await expect(roots.first()).not.toHaveAttribute("data-slot");

  const basicInput = basic.getByRole("combobox");
  const basicContent = basic.locator("[ng-combobox-content]");
  await expect(basicContent).toBeHidden();
  await expect(basicInput).toHaveAttribute("aria-expanded", "false");
  await expect(basicInput).toHaveAttribute("aria-autocomplete", "list");
  await expect(basic.locator("[ng-combobox-control]")).toHaveCSS(
    "height",
    "32px",
  );
  await basicInput.focus();
  await expect(basicContent).toBeVisible();
  await expect(basic.locator('[data-highlighted="true"]')).toHaveCount(0);
  await basicInput.press("Escape");
  await expect(basicContent).toBeHidden();

  const autoInput = automatic.getByRole("combobox");
  await autoInput.focus();
  const first = automatic.locator("[ng-combobox-item]").first();
  await expect(first).toHaveAttribute("data-highlighted", "true");
  const firstId = await first.getAttribute("id");
  await expect(autoInput).toHaveAttribute(
    "aria-activedescendant",
    firstId ?? "",
  );
});

test("AngularTS filtering, empty state, and keyboard selection remain functional", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  const root = page.locator("#basic-combobox");
  const input = root.getByRole("combobox");
  const content = root.locator("[ng-combobox-content]");
  const items = root.locator("[ng-combobox-item]");

  await input.fill("sv");
  await expect(items).toHaveCount(1);
  await expect(items).toHaveText(/SvelteKit/);
  await input.press("ArrowDown");
  await input.press("Enter");
  await expect(root).toHaveAttribute("data-value", "SvelteKit");
  await expect(input).toHaveValue("SvelteKit");
  await expect(page.locator(".output")).toContainText("Basic: SvelteKit");
  await expect(content).toBeHidden();

  await input.fill("no-match");
  await expect(items).toHaveCount(0);
  await expect(root).toHaveAttribute("data-empty", "true");
  await expect(root.locator("[ng-combobox-empty]")).toBeVisible();
  await expect(root.locator("[ng-combobox-empty]")).toHaveAttribute(
    "role",
    "status",
  );
});

test("state artifact covers controlled open, disabled skipping, boundaries, and dynamic options", async ({
  page,
}) => {
  await page.goto(statesUrl);
  await expectBuiltArtifactRuntime(page);
  const root = page.locator("#state-combobox");
  const input = root.getByRole("combobox");
  const content = root.locator("[ng-combobox-content]");
  const items = root.locator("[ng-combobox-item]");

  await page.getByRole("button", { name: "Toggle popup" }).click();
  await expect(root).toHaveAttribute("open", "true");
  await expect(content).toBeVisible();
  await input.press("Home");
  await expect(items.nth(0)).toHaveAttribute("data-highlighted", "true");
  await input.press("ArrowDown");
  await expect(items.nth(1)).toHaveAttribute("aria-disabled", "true");
  await expect(items.nth(2)).toHaveAttribute("data-highlighted", "true");
  await input.press("Enter");
  await expect(page.locator(".combobox-state-output")).toContainText(
    "Selected: Nuxt.js",
  );
  await expect(root).toHaveAttribute("open", "false");

  await input.fill("");
  await page.getByRole("button", { name: "Toggle Astro option" }).click();
  await expect(items).toHaveCount(5);
  await page.getByRole("button", { name: "Toggle popup" }).click();
  await input.press("End");
  await expect(items.last()).toHaveAttribute("data-highlighted", "true");
  await input.press("Enter");
  await expect(page.locator(".combobox-state-output")).toContainText(
    "Selected: Astro",
  );

  await root.locator("[ng-combobox-trigger]").click();
  await expect(content).toBeVisible();
  await page.getByRole("button", { name: "Toggle Astro option" }).click();
  await expect(root).toHaveAttribute("open", "false");
  await expect(content).toBeHidden();
});

test("clear, disabled, and invalid references mirror native and AngularTS state", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  await expectBuiltArtifactRuntime(page);
  const clear = page.locator("#clear-combobox");
  await expect(clear.getByRole("combobox")).toHaveValue("Next.js");
  await clear.getByRole("button", { name: "Clear selection" }).click();
  await expect(clear.getByRole("combobox")).toHaveValue("");
  await expect(clear).toHaveAttribute("data-value", "");
  await expect(page.locator(".output")).toContainText("Clear: none");

  const disabled = page.locator("#disabled-combobox");
  await expect(disabled).toHaveAttribute("data-disabled", "true");
  await expect(disabled.getByRole("combobox")).toBeDisabled();
  await disabled
    .getByRole("button", { name: "Show disabled frameworks" })
    .press("Enter");
  await expect(disabled.locator("[ng-combobox-content]")).toBeHidden();

  const invalid = page.locator("#invalid-combobox");
  await expect(invalid).toHaveAttribute("data-invalid", "true");
  await expect(invalid.getByRole("combobox")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await expect(invalid.locator("[ng-combobox-control]")).toHaveCSS(
    "border-color",
    "rgb(229, 72, 77)",
  );
});

test("grouped and input-addon references preserve labels, separators, filtering, and width", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  const grouped = page.locator("#groups-combobox");
  const input = grouped.getByRole("combobox");
  await input.fill("Tokyo");
  await expect(
    grouped.locator("[ng-combobox-group]").filter({ visible: true }),
  ).toHaveCount(1);
  await expect(
    grouped.locator("[ng-combobox-item]").filter({ visible: true }),
  ).toHaveCount(1);
  const group = grouped
    .locator("[ng-combobox-group]")
    .filter({ visible: true });
  const labelId = await group.locator("[ng-combobox-label]").getAttribute("id");
  await expect(group).toHaveAttribute("role", "group");
  await expect(group).toHaveAttribute("aria-labelledby", labelId ?? "");
  await expect(group.locator("[ng-combobox-separator]")).toHaveAttribute(
    "role",
    "separator",
  );

  const withAddon = page.locator("#input-group-combobox");
  await expect(withAddon.locator(".combobox-globe")).toBeVisible();
  await withAddon.getByRole("combobox").focus();
  await expect(withAddon.locator("[ng-combobox-content]")).toHaveCSS(
    "width",
    "240px",
  );
});

test("popup reference focuses its internal search and selects from a separate trigger", async ({
  page,
}) => {
  await page.goto(workflowsUrl);
  const root = page.locator("#popup-combobox");
  const trigger = root.getByRole("button", { name: "Country" });
  const input = root.getByRole("combobox");
  await trigger.click();
  await expect(root.locator("[ng-combobox-content]")).toBeVisible();
  await expect(input).toBeFocused();
  await input.fill("Japan");
  await expect(root.getByRole("option")).toHaveCount(1);
  await input.press("ArrowDown");
  await input.press("Enter");
  await expect(root.locator("[ng-combobox-value]")).toHaveText("Japan");
  await expect(root).toHaveAttribute("data-value", "Japan");
});

test("multiple reference keeps application chips authoritative and supports remove-last signaling", async ({
  page,
}) => {
  await page.goto(compositionsUrl);
  await expectBuiltArtifactRuntime(page);
  const root = page.locator("#multiple-combobox");
  const input = root.getByRole("combobox");
  const content = root.locator("[ng-combobox-content]");
  const chips = root.locator("[ng-combobox-chip]");
  await expect(root).toHaveAttribute("data-multiple", "true");
  await expect(content).toHaveAttribute("aria-multiselectable", "true");
  await expect(chips).toHaveCount(1);

  await input.focus();
  await input.press("ArrowDown");
  await input.press("Enter");
  await expect(chips).toHaveCount(2);
  await expect(chips.nth(1)).toContainText("SvelteKit");
  await expect(content).toBeVisible();
  await input.fill("");
  await input.press("Backspace");
  await expect(chips).toHaveCount(1);
  await root.getByRole("button", { name: "Remove Next.js" }).click();
  await expect(chips).toHaveCount(0);
});

test("custom and RTL references retain authored option content and logical multi-selection", async ({
  page,
}) => {
  await page.goto(compositionsUrl);
  const custom = page.locator("#custom-combobox");
  const customInput = custom.getByRole("combobox");
  await customInput.fill("Japan");
  const japan = custom.getByRole("option", { name: /Japan/ });
  await expect(japan.locator("[ng-item-description]")).toContainText(
    "Asia (jp)",
  );
  await japan.click();
  await expect(page.locator(".output")).toContainText("Country: Japan");

  const rtl = page.locator("#rtl-combobox");
  await expect(rtl).toHaveAttribute("data-direction", "rtl");
  await expect(rtl.locator("[ng-combobox-content]")).toHaveAttribute(
    "data-direction",
    "rtl",
  );
  await rtl.getByRole("combobox").focus();
  await rtl.getByRole("option", { name: "التصميم", exact: true }).click();
  await expect(rtl.locator("[ng-combobox-chip]")).toHaveCount(2);
  await rtl.getByRole("button", { name: "إزالة التصميم" }).click();
  await expect(rtl.locator("[ng-combobox-chip]")).toHaveCount(1);
});
