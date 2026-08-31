import { expect, test, type Page } from "@playwright/test";
import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

type Contract = (page: Page) => Promise<void>;

const componentNames = readdirSync("src/components")
  .filter((entry) => statSync(join("src/components", entry)).isDirectory())
  .filter((entry) => existsSync(join("src/components", entry, `${entry}.ts`)))
  .sort();

const slot = (page: Page, name: string) =>
  page.locator(`[data-slot='${name}'], [ng-${name}]`);

const assertBuiltArtifactContract = async (
  page: Page,
  sourceRequests: string[],
) => {
  const scriptPaths = await page
    .locator("script[src]")
    .evaluateAll((scripts) =>
      scripts.map(
        (script) => new URL((script as HTMLScriptElement).src).pathname,
      ),
    );

  expect(scriptPaths).toContain("/docs/static/js/angular-ts.umd.js");
  expect(scriptPaths).toContain("/docs/static/js/angular-css.umd.js");
  expect(sourceRequests).toEqual([]);
};

const assertVisualContract = async (page: Page, component: string) => {
  const directive =
    component === "input"
      ? "data-input"
      : component === "resizable"
        ? "ng-resizable-panel-group"
        : component === "sonner"
          ? "ng-toaster"
          : component === "switch"
            ? "ng-switch-control"
            : `ng-${component}`;
  const result = await page.evaluate(
    ({ directive }) => {
      const root = document.querySelector<HTMLElement>(`[${directive}]`);
      const angularSheet = Array.from(document.styleSheets).find((sheet) =>
        sheet.href?.endsWith("/css/angular.css"),
      );

      const matchesRule = (rules: CSSRuleList): boolean =>
        Array.from(rules).some((rule) => {
          if (rule instanceof CSSStyleRule) {
            try {
              return Boolean(root?.matches(rule.selectorText));
            } catch {
              return false;
            }
          }

          return "cssRules" in rule
            ? matchesRule((rule as CSSGroupingRule).cssRules)
            : false;
        });

      const rootBox = root?.getBoundingClientRect();
      const renderedBox =
        rootBox && rootBox.width > 0 && rootBox.height > 0
          ? rootBox
          : root
              ?.querySelector<HTMLElement>("*:not([hidden])")
              ?.getBoundingClientRect();
      const bodyStyle = getComputedStyle(document.body);
      const rootStyle = root ? getComputedStyle(root) : null;
      const clipped = Array.from(
        document.body.querySelectorAll<HTMLElement>("*"),
      )
        .filter((element) => {
          const style = getComputedStyle(element);
          return (
            !element.hidden &&
            style.display !== "none" &&
            style.visibility !== "hidden" &&
            Number(style.opacity) > 0
          );
        })
        .map((element) => ({ element, box: element.getBoundingClientRect() }))
        .filter(({ box }) => box.width > 0 && box.height > 0)
        .filter(({ element, box }) => {
          const outsideViewport =
            box.left < -1 ||
            box.top < -1 ||
            box.right > window.innerWidth + 1 ||
            box.bottom > window.innerHeight + 1;
          if (!outsideViewport) return false;

          let ancestor = element.parentElement;
          while (ancestor && ancestor !== document.body) {
            const style = getComputedStyle(ancestor);
            if (
              /auto|hidden|scroll/.test(
                `${style.overflow}${style.overflowX}${style.overflowY}`,
              )
            ) {
              return false;
            }
            ancestor = ancestor.parentElement;
          }
          return true;
        })
        .map(
          ({ element }) =>
            element.getAttribute("data-slot") || element.tagName.toLowerCase(),
        );

      return {
        angularSheetLoaded: Boolean(
          angularSheet && angularSheet.cssRules.length,
        ),
        bodyFontSize: bodyStyle.fontSize,
        clipped,
        componentRuleApplied: Boolean(
          root && angularSheet && matchesRule(angularSheet.cssRules),
        ),
        rootBox: renderedBox
          ? { height: renderedBox.height, width: renderedBox.width }
          : null,
        spacing: rootStyle?.getPropertyValue("--spacing").trim() || "",
      };
    },
    { directive },
  );

  expect(result.angularSheetLoaded).toBe(true);
  expect(result.bodyFontSize).toBe("14px");
  expect(result.componentRuleApplied).toBe(true);
  expect(result.rootBox, `${component} root must render`).not.toBeNull();
  expect(result.rootBox!.width, `${component} root width`).toBeGreaterThan(0);
  expect(result.rootBox!.height, `${component} root height`).toBeGreaterThan(0);
  expect(Number.parseFloat(result.spacing)).toBe(0.25);
  expect(
    result.clipped,
    `${component} has viewport-clipped visible content`,
  ).toEqual([]);
};

const contracts: Record<string, Contract> = {
  accordion: async (page) => {
    const trigger = page.getByRole("button", {
      name: "What are your shipping options?",
    });
    const icon = trigger.locator(
      `:is([data-slot=accordion-trigger-icon], [ng-accordion-trigger-icon])`,
    );
    await expect(slot(page, "accordion")).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await page
      .getByRole("button", { name: "What is your return policy?" })
      .click();
    await expect(
      page.getByText(/Returns are accepted within 30 days/),
    ).toBeVisible();
    await expect(icon).toHaveCount(1);
    await expect(icon).toHaveAttribute("aria-hidden", "true");
  },
  alert: async (page) => {
    await expect(page.locator("[ng-alert]")).toHaveCount(2);
    expect(
      await page
        .locator("[ng-alert]")
        .evaluateAll((alerts) =>
          alerts.map((alert) => alert.getAttribute("role")),
        ),
    ).toEqual(["alert", "alert"]);
    await expect(slot(page, "alert-title")).toHaveCount(2);
    await expect(slot(page, "alert-description")).toHaveCount(2);
    await expect(slot(page, "alert-icon")).toHaveCount(2);
  },
  "alert-dialog": async (page) => {
    const root = slot(page, "alert-dialog");
    const trigger = slot(page, "alert-dialog-trigger");
    const content = slot(page, "alert-dialog-content");
    await expect(trigger).toBeVisible();
    await expect(content).toBeHidden();
    await expect(trigger).toHaveAttribute(
      "aria-controls",
      "confirmation-dialog-content",
    );
    await trigger.click();
    await expect(root).toHaveAttribute("data-open", "true");
    await expect(content).toHaveAttribute("role", "alertdialog");
    await expect(content).toHaveAttribute("aria-modal", "true");
    await expect(content).toHaveAttribute(
      "aria-labelledby",
      "confirmation-dialog-title",
    );
    await expect(content).toHaveAttribute(
      "aria-describedby",
      "confirmation-dialog-description",
    );
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(content).toBeHidden();
    await expect(trigger).toBeFocused();
    await trigger.click();
    await expect(root).toHaveAttribute("data-open", "true");
    await expect(page.getByRole("alertdialog")).toBeVisible();
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(content).toBeHidden();
  },
  "aspect-ratio": async (page) => {
    const box = await slot(page, "aspect-ratio").boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width / box!.height).toBeCloseTo(16 / 9, 1);
  },
  avatar: async (page) => {
    const avatars = slot(page, "avatar");
    await expect(avatars).toHaveCount(5);
    await expect(slot(page, "avatar-image")).toHaveCount(5);
    await expect(slot(page, "avatar-image").first()).toBeVisible();
    await expect(slot(page, "avatar-fallback").first()).toBeHidden();
    await expect(slot(page, "avatar-group-count")).toBeVisible();
    expect(
      await avatars.evaluateAll((items) =>
        items.map((item) => getComputedStyle(item).width),
      ),
    ).toEqual(["32px", "32px", "32px", "32px", "32px"]);
    await expect(avatars.nth(0)).toHaveCSS("overflow", "visible");
    expect(
      await avatars
        .nth(0)
        .evaluate(
          (avatar) => getComputedStyle(avatar, "::after").borderTopStyle,
        ),
    ).toBe("solid");
    const badge = slot(page, "avatar-badge");
    const [avatarBox, badgeBox] = await Promise.all([
      avatars.nth(1).boundingBox(),
      badge.boundingBox(),
    ]);
    expect(avatarBox).not.toBeNull();
    expect(badgeBox).not.toBeNull();
    expect(badgeBox!.x + badgeBox!.width).toBeGreaterThan(
      avatarBox!.x + avatarBox!.width - 2,
    );
  },
  badge: async (page) => {
    await expect(slot(page, "badge")).not.toHaveCount(0);
    await expect(slot(page, "badge").first()).toBeVisible();
  },
  breadcrumb: async (page) => {
    await expect(page.getByRole("navigation")).toHaveAttribute(
      "aria-label",
      /breadcrumb/i,
    );
    await expect(slot(page, "breadcrumb-page")).toHaveAttribute(
      "aria-current",
      "page",
    );
  },
  button: async (page) => {
    const buttons = page.getByRole("button");
    await expect(buttons).toHaveCount(2);
    await expect(page.getByRole("button", { name: "Button" })).toHaveAttribute(
      "data-variant",
      "outline",
    );
    await expect(page.getByRole("button", { name: "Submit" })).toHaveAttribute(
      "data-size",
      "icon",
    );
  },
  "button-group": async (page) => {
    const copy = page.getByRole("button", { name: "Copy" });
    const separators = slot(page, "button-group-separator");
    const verticalSeparators = page.locator(
      '[data-slot="button-group-separator"][data-orientation="vertical"]',
    );
    await expect(slot(page, "button-group")).toHaveCount(6);
    await expect(separators).toHaveCount(3);
    await expect(verticalSeparators).toHaveCount(2);
    await expect(verticalSeparators.first()).toHaveCSS("width", "1px");
    await expect(
      page.getByRole("group", { name: "Media controls" }),
    ).toHaveAttribute("data-orientation", "vertical");
    await copy.click();
    await expect(page.locator(".output")).toContainText("Action: Copy");
    await expect(copy).not.toHaveAttribute("aria-pressed");
  },
  calendar: async (page) => {
    const calendar = page.locator("[ng-calendar]");
    await expect(slot(page, "calendar-day")).toHaveCount(42);
    await slot(page, "calendar-day").filter({ hasText: /^20$/ }).click();
    await expect(page.locator(".output")).toContainText("2026-05-20");
    await slot(page, "calendar-next").click();
    await expect(
      slot(page, "calendar-title").getByRole("combobox", { name: "Month" }),
    ).toHaveValue("5");
    await expect(calendar).toHaveAttribute("data-month", "2026-06");
  },
  card: async (page) => {
    const email = page.locator("#card-email");
    await page.getByText("Email", { exact: true }).click();
    await expect(email).toBeFocused();
    await email.fill("jane@example.com");
    await expect(email).toHaveValue("jane@example.com");
  },
  carousel: async (page) => {
    const root = page.locator("[ng-carousel]");
    const next = page.getByRole("button", { name: "Next" });
    await expect(root).toHaveAttribute("data-index", "0");
    for (const index of [1, 2, 3, 4]) {
      await next.click();
      await expect(root).toHaveAttribute("data-index", String(index));
    }
    await expect(next).toBeDisabled();
  },
  chart: async (page) => {
    const chart = page.locator("[ng-chart]");
    const bars = slot(page, "chart-bar");
    await expect(chart).toHaveAttribute("role", "img");
    await expect(slot(page, "chart-bar-group")).toHaveCount(6);
    await expect(bars).toHaveCount(12);
    await expect(bars.nth(2)).toHaveAttribute("data-value", "100%");
    await expect(bars.nth(2)).toHaveCSS("--value", "100%");
  },
  checkbox: async (page) => {
    const checkbox = page.locator("#terms-checkbox");
    await expect(checkbox).toHaveAttribute("ng-checkbox", "");
    await expect(checkbox).not.toHaveAttribute("data-slot");
    await expect(page.locator("[ng-checkbox]")).toHaveCount(4);
    await checkbox.check();
    await expect(page.getByRole("status")).toContainText("Terms accepted");
    await expect(checkbox).toHaveAttribute("data-state", "checked");
    expect(
      await checkbox.evaluate(
        (element) => getComputedStyle(element, "::after").display,
      ),
    ).toBe("block");
  },
  collapsible: async (page) => {
    const root = page.locator("[ng-collapsible]");
    const trigger = page.getByRole("button", { name: "Toggle details" });
    await expect(root).toHaveAttribute("data-state", "closed");
    await expect(page.getByText("Status", { exact: true })).toBeVisible();
    await trigger.click();
    await expect(root).toHaveAttribute("data-state", "open");
    await expect(page.getByRole("status")).toContainText("expanded");
  },
  combobox: async (page) => {
    const roots = page.locator("[ng-combobox]");
    const basic = page.locator("#basic-combobox");
    const automatic = page.locator("#auto-combobox");
    const basicInput = basic.getByRole("combobox");
    await expect(roots).toHaveCount(2);
    await expect(roots.first()).not.toHaveAttribute("data-slot");
    await expect(page.locator("[ng-combobox-list]")).toHaveCount(2);
    await expect(page.locator("[ng-combobox-collection]")).toHaveCount(2);
    await expect(basic.locator("[ng-combobox-content]")).toBeHidden();

    await basicInput.fill("SvelteKit");
    await expect(basic.getByRole("option")).toHaveCount(1);
    await basicInput.press("ArrowDown");
    await basicInput.press("Enter");
    await expect(basicInput).toHaveValue("SvelteKit");
    await expect(page.locator(".output")).toContainText("Basic: SvelteKit");

    const automaticInput = automatic.getByRole("combobox");
    await automaticInput.focus();
    await expect(automatic.getByRole("option").first()).toHaveAttribute(
      "data-highlighted",
      "true",
    );
  },
  command: async (page) => {
    const root = page.locator("#command-demo");
    const input = root.getByRole("combobox");
    await expect(root).not.toHaveAttribute("data-slot");
    await expect(root.getByRole("option")).toHaveCount(6);
    await input.fill("settings");
    await expect(root.locator("[ng-command-group-heading]:visible")).toHaveText(
      "Settings",
    );
    await expect(root.getByRole("option")).toHaveCount(1);
    await expect(root.locator("[ng-command-separator]")).toHaveCSS(
      "height",
      "1px",
    );
    await expect(input).toHaveAttribute("aria-activedescendant", /.+/);
    await input.press("Enter");
    await expect(page.locator(".output")).toContainText("Selected: Settings");
  },
  "context-menu": async (page) => {
    const trigger = slot(page, "context-menu-trigger");
    await trigger.click();
    await expect(slot(page, "context-menu-content")).toBeHidden();
    await trigger.click({ button: "right" });
    await expect(slot(page, "context-menu-content")).toBeVisible();
    await expect(page.locator("[ng-context-menu]")).toHaveAttribute(
      "data-open",
      "true",
    );
    await expect(slot(page, "context-menu-group").first()).toBeVisible();
    await expect(
      page.getByRole("menuitem", { name: /^Forward/ }),
    ).toBeDisabled();
    const subTrigger = slot(page, "context-menu-sub-trigger");
    await subTrigger.evaluate((element) =>
      element.focus({ preventScroll: true }),
    );
    await subTrigger.press("ArrowRight");
    await expect(slot(page, "context-menu-sub-content")).toBeVisible();
    await expect(
      page.getByRole("menuitem", { name: "Save Page..." }),
    ).toBeFocused();
    await page.keyboard.press("ArrowLeft");
    await expect(slot(page, "context-menu-sub-content")).toBeHidden();
    await page.keyboard.press("Escape");
    await expect(page.locator("[ng-context-menu]")).toHaveAttribute(
      "data-open",
      "false",
    );
  },
  dialog: async (page) => {
    const root = page.locator("[ng-dialog]");
    const trigger = page.getByRole("button", { name: "Edit profile" });
    await expect(trigger).toBeVisible();
    await expect(root).toHaveAttribute("data-open", "false");
    await trigger.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.locator("#dialog-name")).toBeFocused();
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(root).toHaveAttribute("data-open", "false");
  },
  direction: async (page) => {
    await expect(page.locator("#direction-rtl")).toHaveAttribute(
      "data-direction",
      "rtl",
    );
  },
  drawer: async (page) => {
    const root = page.locator("[ng-drawer]");
    const trigger = page.getByRole("button", { name: "Open Drawer" });
    const content = page.locator("[ng-drawer-content]");
    await expect(trigger).toBeVisible();
    await expect(root).toHaveAttribute("data-open", "false");
    await expect(root).toHaveAttribute("data-side", "bottom");
    await trigger.click();
    await expect(root).toHaveAttribute("data-open", "true");
    await expect(content).toHaveAttribute("role", "dialog");
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(root).toHaveAttribute("data-open", "false");
  },
  dropdown: async (page) => {
    const trigger = page.getByRole("button", { name: "Options" });
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("menu")).toBeVisible();
    await expect(slot(page, "dropdown-menu-group")).toBeVisible();
    await expect(slot(page, "dropdown-menu-label")).toBeVisible();
    await expect(slot(page, "dropdown-menu-separator")).toBeVisible();
    await expect(slot(page, "dropdown-menu-shortcut")).toBeVisible();
    await expect(
      slot(page, "dropdown-menu-checkbox-item-indicator"),
    ).toBeVisible();
    await expect(
      slot(page, "dropdown-menu-radio-item-indicator").first(),
    ).toBeVisible();
    const subTrigger = slot(page, "dropdown-menu-sub-trigger");
    await subTrigger.evaluate((element) =>
      element.focus({ preventScroll: true }),
    );
    await subTrigger.press("ArrowRight");
    await expect(slot(page, "dropdown-menu-sub-content")).toBeVisible();
    await expect(
      page.getByRole("menuitem", { name: "Copy link" }),
    ).toBeFocused();
    await page.keyboard.press("ArrowLeft");
    await expect(slot(page, "dropdown-menu-sub-content")).toBeHidden();
  },
  empty: async (page) => {
    await expect(slot(page, "empty-title")).toHaveText("No Projects Yet");
    await expect(
      page.getByRole("button", { name: "Create Project" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Learn More" })).toBeVisible();
  },
  field: async (page) => {
    const email = page.locator("#demo-profile-email");
    await expect(email).toHaveAttribute("aria-describedby", /field-message-/);
    await expect(email).toHaveAttribute("aria-invalid", "true");
    await email.fill("jane@example.com");
    await expect(email).toHaveAttribute("aria-invalid", "false");
    await expect(email).not.toHaveAttribute("aria-describedby", /.+/);
    await expect(page.locator(".output")).toContainText("jane@example.com");
  },
  "hover-card": async (page) => {
    const trigger = slot(page, "hover-card-trigger");
    await trigger.focus();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(slot(page, "hover-card-content")).toBeVisible();
    await trigger.blur();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  },
  input: async (page) => {
    const input = page.locator("#docs-input-search");
    await input.fill("functional");
    await expect(input).toHaveValue("functional");
    await expect(page.locator(".output")).toContainText("functional");
    await expect(input).not.toHaveAttribute("data-empty");
  },
  "input-group": async (page) => {
    const input = page.locator(
      ":is([data-slot=input-group-control], [ng-input-group-control])",
    );
    const group = slot(page, "input-group");
    await input.focus();
    await expect(input).toHaveAttribute(
      "aria-describedby",
      /input-group-addon-/,
    );
    await expect(group).not.toHaveCSS("box-shadow", "none");
  },
  "input-otp": async (page) => {
    const inputs = slot(page, "input-otp-slot").locator("input");
    await expect(inputs).toHaveCount(6);
    await expect(page.locator("[ng-input-otp]")).toHaveAttribute(
      "data-value",
      "123456",
    );
    await inputs.nth(0).fill("9");
    await expect(inputs.nth(1)).toBeFocused();
    await expect(page.getByRole("status")).toContainText("Code: 923456");
  },
  item: async (page) => {
    await expect(slot(page, "item")).toHaveCount(3);
    await expect(slot(page, "item-title").first()).toHaveText(
      "Profile verified",
    );
  },
  kbd: async (page) => {
    await expect(page.locator("kbd")).not.toHaveCount(0);
    await expect(slot(page, "kbd").first()).toBeVisible();
  },
  label: async (page) => {
    await page.getByText("Email", { exact: true }).click();
    await expect(page.locator("#email")).toBeFocused();
  },
  menubar: async (page) => {
    const file = page.getByRole("menuitem", { name: "File", exact: true });
    const fileContent = file
      .locator("..")
      .locator(":scope > [ng-menubar-content]");
    await expect(file).toHaveAttribute("aria-expanded", "false");
    await file.click();
    await expect(file).toHaveAttribute("aria-expanded", "true");
    await expect(fileContent).toBeVisible();
    await expect(
      fileContent.locator("[ng-menubar-group]").first(),
    ).toBeVisible();
    await expect(slot(page, "menubar-radio-group")).toHaveCount(1);
    await expect(
      fileContent.locator("[ng-menubar-shortcut]").first(),
    ).toBeVisible();
    const subTrigger = fileContent.getByRole("menuitem", { name: "Share" });
    const subContent = subTrigger
      .locator("..")
      .locator("[ng-menubar-sub-content]");
    await subTrigger.evaluate((element) =>
      element.focus({ preventScroll: true }),
    );
    await subTrigger.press("ArrowRight");
    await expect(subContent).toBeVisible();
    await expect(
      subContent.getByRole("menuitem", { name: "Email link" }),
    ).toBeFocused();
    await page.keyboard.press("ArrowLeft");
    await expect(subContent).toBeHidden();
    await page.keyboard.press("Escape");
    await expect(file).toHaveAttribute("aria-expanded", "false");
  },
  "native-select": async (page) => {
    const select = page.getByRole("combobox", { name: "Status" });
    await expect(slot(page, "native-select-icon")).toBeVisible();
    await expect(select.locator("option")).toHaveCount(5);
    await select.selectOption("done");
    await expect(select).toHaveAttribute("data-value", "done");
  },
  "navigation-menu": async (page) => {
    const nav = page.getByRole("navigation", { name: "Primary navigation" });
    const trigger = nav.getByRole("button", { name: "Getting started" });
    const item = trigger.locator("..");
    const indicator = item.locator(":scope > [ng-navigation-menu-indicator]");
    await expect(nav.getByRole("link", { name: "Docs" })).toHaveAttribute(
      "href",
      "#docs",
    );
    await expect(nav.getByRole("menu")).toHaveCount(0);
    await expect(nav.getByRole("menuitem")).toHaveCount(0);
    await expect(indicator).toBeHidden();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(indicator).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toBeFocused();
  },
  pagination: async (page) => {
    const pagination = page.getByRole("navigation", { name: "pagination" });
    const links = pagination.locator("[data-slot='pagination-link']");
    const previous = pagination.getByRole("link", {
      name: "Go to previous page",
    });
    const next = pagination.getByRole("link", { name: "Go to next page" });
    await expect(links).toHaveCount(3);
    await expect(pagination.locator("[aria-current='page']")).toHaveCount(1);
    await expect(previous).toHaveAttribute("href", "#previous");
    await expect(next).toHaveAttribute("href", "#next");
    await expect(previous.locator("svg[data-icon='inline-start']")).toHaveCount(
      1,
    );
    await expect(next.locator("svg[data-icon='inline-end']")).toHaveCount(1);
    await expect(slot(page, "pagination-ellipsis")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect((await links.first().boundingBox())?.height).toBe(32);
  },
  popover: async (page) => {
    const trigger = page.getByRole("button", { name: "Open popover" });
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(slot(page, "popover-content")).toBeVisible();
  },
  progress: async (page) => {
    const timed = page.locator(".progress-demo-timed");
    await expect(timed).toHaveAttribute("aria-valuenow", "66");
    await expect(timed).toHaveAttribute("aria-valuemax", "100");
    await expect(timed).toHaveAttribute("data-value", "66");
    await expect(timed.locator('[data-slot="progress-track"]')).toHaveCSS(
      "height",
      "4px",
    );

    const labeled = page.locator(".progress-demo-labeled");
    const label = labeled.locator('[data-slot="progress-label"]');
    await expect(label).toHaveAttribute("id", /progress-label-\d+/);
    await expect(labeled).toHaveAttribute(
      "aria-labelledby",
      (await label.getAttribute("id")) ?? "",
    );
    await expect(labeled.locator('[data-slot="progress-value"]')).toHaveText(
      "56%",
    );
  },
  "radio-group": async (page) => {
    const compact = page.locator("#density-compact");
    await expect(slot(page, "radio-group")).toBeVisible();
    await compact.check();
    await expect(page.locator(".output")).toContainText("compact");
    await expect(compact).toHaveAttribute("data-state", "checked");
    expect(
      await compact.evaluate(
        (element) => getComputedStyle(element, "::after").display,
      ),
    ).toBe("block");
  },
  resizable: async (page) => {
    const handle = slot(page, "resizable-handle").first();
    const before = await handle.getAttribute("aria-valuenow");
    await handle.focus();
    await handle.press("ArrowRight");
    await expect(handle).not.toHaveAttribute("aria-valuenow", before || "");

    const box = await handle.boundingBox();
    expect(box).not.toBeNull();
    const pointerStart = box!.x + box!.width / 2;
    await page.mouse.move(pointerStart, box!.y + box!.height / 2);
    await page.mouse.down();
    await page.mouse.move(pointerStart + 24, box!.y + box!.height / 2);
    await expect(handle).toHaveAttribute("data-resizing", "true");
    await page.mouse.up();
    await expect(handle).not.toHaveAttribute("data-resizing", "true");
  },
  "scroll-area": async (page) => {
    const root = page.locator("[ng-scroll-area]");
    const viewport = page.locator("[ng-scroll-area-viewport]");
    await viewport.evaluate((element) => {
      element.scrollTop = element.scrollHeight;
      element.scrollLeft = element.scrollWidth;
      element.dispatchEvent(new Event("scroll"));
    });
    await expect(root).toHaveAttribute("data-scroll-at-bottom", "true");
    await expect(root).toHaveAttribute("data-scrollable-y", "true");
    await expect(root).toHaveAttribute("data-scrollable-x", "true");
  },
  select: async (page) => {
    await expect(slot(page, "select-value")).toContainText("Select a fruit");
    await slot(page, "select-trigger").click();
    await expect(slot(page, "select-group")).toBeVisible();
    await expect(slot(page, "select-item")).toHaveCount(6);
    await page.getByRole("option", { name: "Banana", exact: true }).click();
    await expect(page.locator(".output")).toContainText("Selected: banana");
    await expect(page.locator("[ng-select]")).toHaveAttribute(
      "data-value",
      "banana",
    );
    await expect(slot(page, "select-value")).toContainText("Banana");
  },
  separator: async (page) => {
    await expect(page.getByRole("separator")).not.toHaveCount(0);
    await expect(page.getByRole("separator").first()).toHaveAttribute(
      "aria-orientation",
      /horizontal|vertical/,
    );
  },
  sheet: async (page) => {
    const root = slot(page, "sheet");
    const trigger = slot(page, "sheet-trigger");
    const content = slot(page, "sheet-content");
    await expect(trigger).toBeVisible();
    await expect(content).toBeHidden();
    await trigger.click();
    await expect(root).toHaveAttribute("data-open", "true");
    await expect(content).toHaveAttribute("data-side", "right");
    await expect(content).toHaveAttribute("role", "dialog");
    await expect(content).toHaveAttribute("aria-modal", "true");
    await page.getByRole("button", { name: "Close", exact: true }).click();
    await expect(root).toHaveAttribute("data-open", "false");
    await expect(trigger).toBeFocused();
  },
  sidebar: async (page) => {
    const sidebar = page.locator("#app-sidebar");
    await expect(slot(page, "sidebar-layout")).toBeVisible();
    await expect(slot(page, "sidebar-header")).toBeVisible();
    await expect(slot(page, "sidebar-content")).toBeVisible();
    await expect(slot(page, "sidebar-footer")).toBeVisible();
    await expect(slot(page, "sidebar-inset")).toBeVisible();
    await expect(slot(page, "sidebar-separator")).toBeVisible();
    await slot(page, "sidebar-input").fill("projects");
    await expect(slot(page, "sidebar-input")).toHaveValue("projects");
    await expect(page.locator(".sidebar-query-output")).toContainText(
      "Filter: projects",
    );
    await page.getByRole("button", { name: "Close Sidebar" }).click();
    await expect(sidebar).toHaveAttribute("data-state", "collapsed");
    await expect(sidebar).toHaveAttribute("aria-hidden", "false");
    await page.getByRole("button", { name: "Open Sidebar" }).click();
    await expect(sidebar).toHaveAttribute("data-state", "expanded");
  },
  skeleton: async (page) => {
    await expect(slot(page, "skeleton")).not.toHaveCount(0);
    await expect(slot(page, "skeleton").first()).toHaveCSS(
      "animation-name",
      /angularcss-skeleton-pulse/,
    );
  },
  slider: async (page) => {
    const slider = page.locator("#volume");
    await expect(slider).toHaveAttribute("ng-slider", "");
    await expect(slider).not.toHaveAttribute("data-slot");
    await slider.fill("42");
    await expect(page.locator('output[for="volume"]')).toHaveText("42");
    await expect(slider).toHaveAttribute("aria-valuenow", "42");
    await expect(slider).toHaveCSS("--value", "42%");
  },
  sonner: async (page) => {
    await expect(slot(page, "toast")).toHaveCount(0);
    await page.getByRole("button", { name: "Show Toast" }).click();
    await expect(slot(page, "toast")).toHaveCount(1);
    await expect(slot(page, "toast")).toHaveAttribute("data-state", "open");
    await expect(page.getByRole("button", { name: "Undo" })).toHaveAttribute(
      "type",
      "button",
    );
  },
  spinner: async (page) => {
    await expect(page.getByRole("status")).not.toHaveCount(0);
    await expect(slot(page, "spinner").first()).toHaveCSS(
      "animation-name",
      /angularcss-spinner-spin/,
    );
  },
  switch: async (page) => {
    const control = page.locator("#airplane-mode");
    await control.check();
    await expect(page.locator(".output")).toContainText("Mode enabled: true");
    await expect(control).toHaveAttribute("role", "switch");
  },
  table: async (page) => {
    await expect(page.getByRole("table")).toBeVisible();
    await expect(page.getByRole("row")).not.toHaveCount(0);
    await expect(slot(page, "table-caption")).toBeVisible();
  },
  tabs: async (page) => {
    const analytics = page.getByRole("tab", { name: "Analytics" });
    await analytics.click();
    await expect(analytics).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tabpanel")).toContainText("Page views are up");
  },
  textarea: async (page) => {
    const textarea = page.locator("#docs-textarea-message");
    await textarea.fill("Accessible components");
    await expect(page.locator(".output")).toContainText(
      "Message: Accessible components",
    );
  },
  toggle: async (page) => {
    const bold = page.getByRole("button", { name: "Bold" });
    await bold.click();
    await expect(bold).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".output")).toContainText("Bold: on");
  },
  "toggle-group": async (page) => {
    const left = page.getByRole("button", { name: "Left" });
    await left.click();
    await expect(left).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".output")).toContainText("Alignment: left");
  },
  tooltip: async (page) => {
    const trigger = page.getByRole("button", { name: "Hover" });
    await trigger.focus();
    await expect(slot(page, "tooltip-content")).toBeVisible();
    await trigger.press("Escape");
    await expect(slot(page, "tooltip-content")).toBeHidden();
  },
};

test("published component contracts cover every canonical component", () => {
  expect(Object.keys(contracts).sort()).toEqual(componentNames);
});

for (const component of componentNames) {
  test(`${component} published example satisfies its functional contract`, async ({
    page,
  }) => {
    const errors: string[] = [];
    const sourceRequests: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("request", (request) => {
      const path = new URL(request.url()).pathname;
      if (path.startsWith("/src/")) sourceRequests.push(path);
    });
    await page.goto(`/docs/static/examples/components/${component}.html`);
    await assertBuiltArtifactContract(page, sourceRequests);
    await contracts[component](page);
    await assertVisualContract(page, component);
    expect(errors).toEqual([]);
  });
}
