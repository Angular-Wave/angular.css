import { expect, test } from "@playwright/test";
import { existsSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

function listHtmlFiles(directory: string): string[] {
  return readdirSync(directory)
    .flatMap((entry) => {
      const path = join(directory, entry);
      return statSync(path).isDirectory() ? listHtmlFiles(path) : path;
    })
    .filter((path) => path.endsWith(".html"))
    .sort();
}

const componentExampleFiles = listHtmlFiles("docs/static/examples/components");
const componentNames = readdirSync("src/components")
  .filter((entry) => statSync(join("src/components", entry)).isDirectory())
  .filter((entry) => existsSync(join("src/components", entry, `${entry}.ts`)))
  .sort();

test("developer index links every canonical component to functional HTML", async ({
  page,
}) => {
  await page.goto("/");

  const links = page.locator(".component-catalog-list a");
  await expect(links).toHaveCount(componentNames.length);

  const linkedComponents = await links.evaluateAll((elements) =>
    elements
      .map(
        (element) =>
          element
            .getAttribute("href")
            ?.match(/\/examples\/components\/([^/]+)\.html$/)?.[1],
      )
      .filter((component): component is string => Boolean(component))
      .sort(),
  );
  expect(linkedComponents).toEqual(componentNames);

  await page.getByRole("link", { name: "accordion", exact: true }).click();
  await expect(page).toHaveURL(/\/examples\/components\/accordion\.html$/);

  const trigger = page.getByRole("button", {
    name: "What are your shipping options?",
  });
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
});

test("published calendar renders complete months and updates AngularTS state", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/components/calendar.html");

  const calendar = page.locator("[ng-calendar]");
  const title = page.locator(
    ":is([data-slot=calendar-title], [ng-calendar-title])",
  );
  const days = page.locator(":is([data-slot=calendar-day], [ng-calendar-day])");
  await expect(title.getByRole("combobox", { name: "Month" })).toHaveValue("4");
  await expect(title.getByRole("combobox", { name: "Year" })).toHaveValue(
    "2026",
  );
  await expect(days).toHaveCount(42);

  await page
    .locator(
      ":is([data-slot=calendar-day], [ng-calendar-day])[data-value='2026-05-20']",
    )
    .click();
  await expect(calendar).toHaveAttribute("data-value", "2026-05-20");
  await expect(page.locator(".output")).toContainText("Selected: 2026-05-20");

  await page
    .locator(":is([data-slot=calendar-next], [ng-calendar-next])")
    .click();
  await expect(title.getByRole("combobox", { name: "Month" })).toHaveValue("5");
  await expect(calendar).toHaveAttribute("data-month", "2026-06");
  await expect(days).toHaveCount(42);

  await page
    .locator(":is([data-slot=calendar-previous], [ng-calendar-previous])")
    .click();
  await expect(title.getByRole("combobox", { name: "Month" })).toHaveValue("4");
});

test("published calendar workflow page covers basic, booked, caption, multiple, range, and week-number behavior", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/components/calendar-workflows.html");

  const calendars = page.locator("[ng-calendar]");
  await expect(calendars).toHaveCount(6);

  const basic = calendars.nth(0);
  await basic.locator(`[data-value="2026-09-09"]`).click();
  await expect(page.locator(".calendar-workflow-output").nth(0)).toContainText(
    "2026-09-09",
  );

  const booked = calendars.nth(1);
  await expect(booked.locator(`[data-booked="true"]`)).toHaveCount(15);
  await expect(booked.locator(`[data-value="2026-09-10"]`)).toBeDisabled();

  const caption = calendars.nth(2);
  await expect(caption.getByRole("combobox", { name: "Month" })).toHaveValue(
    "8",
  );
  await caption.getByRole("combobox", { name: "Month" }).selectOption("9");
  await expect(caption).toHaveAttribute("data-month", "2026-10");

  const multiple = calendars.nth(3);
  await expect(multiple.locator(`[aria-selected="true"]`)).toHaveCount(2);
  await multiple.locator(`[data-value="2026-09-14"]`).click();
  await expect(page.locator(".calendar-workflow-output").nth(3)).toContainText(
    "2026-09-14",
  );

  const range = calendars.nth(4);
  await expect(
    range.locator(`:is([data-slot=calendar-month], [ng-calendar-month])`),
  ).toHaveCount(2);
  await expect(range.locator(`[data-range-middle="true"]`)).toHaveCount(4);
  await expect(range.locator(`[data-value="2026-09-10"]`)).toHaveAttribute(
    "data-range",
    "start",
  );
  await range.locator(`[data-value="2026-09-20"]`).first().click();
  await range.locator(`[data-value="2026-09-23"]`).first().click();
  await expect(range).toHaveAttribute("data-range-end-value", "2026-09-23");
  await expect(page.locator(".calendar-workflow-output").nth(4)).toContainText(
    "2026-09-20 to 2026-09-23",
  );

  const weekNumbers = calendars.nth(5);
  await expect(
    weekNumbers.locator(
      `:is([data-slot=calendar-week-number], [ng-calendar-week-number])`,
    ),
  ).toHaveCount(6);
});

test("published calendar compositions keep custom content and application state functional", async ({
  page,
}) => {
  await page.goto(
    "/docs/static/examples/components/calendar-compositions.html",
  );

  const calendars = page.locator("[ng-calendar]");
  await expect(calendars).toHaveCount(5);

  const custom = calendars.nth(0);
  await expect(
    custom.locator(`:is([data-slot=calendar-day], [ng-calendar-day])`),
  ).toHaveCount(42);
  await expect(custom.locator(`[data-range-middle="true"]`)).toHaveCount(4);
  await expect(custom.locator(`[data-value="2026-09-12"] span`)).toHaveText(
    "$120",
  );
  await custom.locator(`[data-value="2026-09-20"]`).click();
  await custom.locator(`[data-value="2026-09-22"]`).click();
  await expect(page.locator(".calendar-workflow-output").nth(0)).toContainText(
    "2026-09-20 to 2026-09-22",
  );

  await page.getByRole("button", { name: "In 2 weeks" }).click();
  await expect(calendars.nth(1)).toHaveAttribute("data-value", "2026-09-26");
  await expect(page.locator(".calendar-workflow-output").nth(1)).toContainText(
    "2026-09-26",
  );

  await page.getByRole("textbox", { name: "Start time" }).fill("10:30");
  await page.getByRole("textbox", { name: "End time" }).fill("18:15");
  await expect(page.locator(".calendar-workflow-output").nth(2)).toContainText(
    "10:30–18:15",
  );

  const rtl = calendars.nth(3);
  await expect(rtl).toHaveAttribute("data-direction", "rtl");
  await expect(
    rtl.locator(`:is([data-slot=calendar-weekday], [ng-calendar-weekday])`),
  ).toHaveText(["ح", "ن", "ث", "ر", "خ", "ج", "س"]);

  const hijri = calendars.nth(4);
  await expect(
    hijri.locator(`:is([data-slot=calendar-day], [ng-calendar-day])`),
  ).toHaveCount(42);
  await hijri.locator(`[data-value="2025-06-15"]`).click();
  await expect(page.locator(".calendar-workflow-output").nth(4)).toContainText(
    "2025-06-15",
  );
});

test("published card workflows use local media and retain AngularTS RTL form state", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/components/card-workflows.html");

  await expect(page.locator("[ng-card]")).toHaveCount(3);
  await expect(page.locator(".card-cover-image")).toHaveAttribute(
    "src",
    "../../images/avatars/01.png",
  );
  await page.getByRole("button", { name: "View Event" }).click();
  await expect(page.locator(".card-workflow-output").nth(0)).toContainText(
    "Viewing Design systems meetup",
  );

  await page.locator("#card-email-rtl").fill("jane@example.com");
  await page.locator("#card-password-rtl").fill("secret");
  await page.getByRole("button", { name: "تسجيل الدخول", exact: true }).click();
  await expect(page.locator(".card-workflow-output").nth(1)).toContainText(
    "jane@example.com",
  );
  const smallCard = page.locator("[ng-card]").nth(2);
  await expect(smallCard).toHaveAttribute("size", "sm");
  await smallCard.getByRole("button", { name: "See what's new" }).click();
  await expect(page.locator(".card-workflow-output").nth(2)).toHaveText(
    "Showing report updates",
  );
});

test("published carousel pages cover every reference workflow with functional HTML", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/components/carousel-workflows.html");

  const workflows = page.locator("[ng-carousel]");
  await expect(workflows).toHaveCount(4);
  await workflows.nth(0).locator("[ng-carousel-next]").click();
  await expect(page.locator(".carousel-status").first()).toHaveText(
    "Slide 2 of 5",
  );
  await expect(workflows.nth(1)).toHaveAttribute("data-count", "3");
  await workflows.nth(2).press("ArrowDown");
  await expect(workflows.nth(2)).toHaveAttribute("data-index", "1");
  await expect(workflows.nth(3)).toHaveAttribute("autoplay", "");

  await page.goto(
    "/docs/static/examples/components/carousel-compositions.html",
  );
  const compositions = page.locator("[ng-carousel]");
  await expect(compositions).toHaveCount(3);
  await expect(compositions.first()).toHaveAttribute("data-direction", "rtl");
  await compositions.first().locator("[ng-carousel-next]").click();
  await expect(compositions.first()).toHaveAttribute("data-index", "1");
  await expect(
    compositions
      .first()
      .locator(`:is([data-slot=carousel-item], [ng-carousel-item])`)
      .nth(1),
  ).toContainText("٢");
});

test("published chart pages cover every reference workflow with functional HTML", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/components/chart.html");
  await expect(
    page.locator(`:is([data-slot=chart-bar-group], [ng-chart-bar-group])`),
  ).toHaveCount(6);
  await expect(
    page.locator(`:is([data-slot=chart-bar], [ng-chart-bar])`),
  ).toHaveCount(12);
  expect(
    (
      await page
        .locator(`:is([data-slot=chart-bar], [ng-chart-bar])`)
        .first()
        .boundingBox()
    )?.height,
  ).toBeGreaterThan(90);

  await page.goto("/docs/static/examples/components/chart-workflows.html");
  await expect(page.locator("[ng-chart]")).toHaveCount(4);
  const tooltipWorkflow = page.locator(
    "[aria-labelledby='chart-tooltip-heading']",
  );
  await tooltipWorkflow
    .locator(`:is([data-slot=chart-bar-group], [ng-chart-bar-group])`)
    .first()
    .hover();
  await expect(
    tooltipWorkflow.locator(
      `:is([data-slot=chart-tooltip], [ng-chart-tooltip])`,
    ),
  ).toContainText("Desktop186");

  await page.goto("/docs/static/examples/components/chart-compositions.html");
  const controls = page.locator(".chart-series-controls > button");
  const firstBar = page
    .locator(`.chart-daily-bars :is([data-slot=chart-bar], [ng-chart-bar])`)
    .first();
  await controls.nth(1).click();
  await expect(firstBar).toHaveAttribute("data-value", "36%");
  await expect(page.locator(`.chart-composition[dir="rtl"]`)).toHaveAttribute(
    "dir",
    "rtl",
  );
  await expect(
    page.locator(
      `.chart-tooltip-gallery :is([data-slot=chart-tooltip], [ng-chart-tooltip])`,
    ),
  ).toHaveCount(4);
});

test("published checkbox pages cover every reference workflow with functional HTML", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/components/checkbox.html");
  const terms = page.locator("#terms-checkbox");
  await expect(page.locator("[ng-checkbox]")).toHaveCount(4);
  await terms.check();
  await expect(terms).toBeChecked();
  await expect(page.getByRole("status")).toContainText("Terms accepted");

  await page.goto("/docs/static/examples/components/checkbox-workflows.html");
  await expect(page.locator("[ng-checkbox]")).toHaveCount(12);
  await expect(page.locator("#terms-checkbox-desc")).toBeChecked();
  await expect(page.locator("#toggle-checkbox-disabled")).toBeDisabled();
  await expect(page.locator("#terms-checkbox-invalid")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await page.locator("#connected-servers").check();
  await expect(page.getByRole("status")).toContainText("Servers true");

  await page.goto(
    "/docs/static/examples/components/checkbox-compositions.html",
  );
  const table = page.getByRole("table", { name: "Team members" });
  await expect(table.locator("tbody tr")).toHaveCount(4);
  await page.getByRole("checkbox", { name: "Select all rows" }).check();
  await expect(table.locator("tbody [ng-checkbox]:checked")).toHaveCount(4);
  await page.getByLabel("Select Marcus Rodriguez").uncheck();
  await expect(
    page.getByRole("checkbox", { name: "Select all rows" }),
  ).not.toBeChecked();
});

test("published collapsible pages cover every reference workflow with functional HTML", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/components/collapsible.html");
  const trigger = page.getByRole("button", { name: "Toggle details" });
  await trigger.click();
  await expect(page.locator("[ng-collapsible]")).toHaveAttribute(
    "data-state",
    "open",
  );
  await expect(
    page.getByText("Shipping address", { exact: true }),
  ).toBeVisible();

  await page.goto(
    "/docs/static/examples/components/collapsible-workflows.html",
  );
  await page.locator(".collapsible-product summary").click();
  await expect(page.getByText("Learn More", { exact: true })).toBeVisible();
  const settings = page.locator(".collapsible-settings");
  await page
    .getByRole("button", { name: "Toggle additional radius settings" })
    .click();
  await expect(settings.locator("input:visible")).toHaveCount(4);

  await page.goto(
    "/docs/static/examples/components/collapsible-compositions.html",
  );
  const tree = page.locator(".collapsible-file-tree");
  await tree.locator("details").first().locator(":scope > summary").click();
  await expect(tree.getByText("login-form.tsx", { exact: true })).toBeVisible();
});

test("published date-picker workflows retain AngularTS model ownership", async ({
  page,
}) => {
  await page.goto(
    "/docs/static/examples/components/date-picker-workflows.html",
  );

  const basicTrigger = page.locator("#date-picker-basic");
  await basicTrigger.click();
  const basicCalendar = page
    .getByRole("dialog", { name: "Choose a basic date" })
    .locator("[ng-calendar]");
  await basicCalendar.locator(`[data-value="2026-09-12"]`).click();
  await expect(basicTrigger).toContainText("September 12, 2026");
  await page.keyboard.press("Escape");

  const rangeTrigger = page.locator("#date-picker-range");
  await rangeTrigger.click();
  const rangeCalendar = page
    .getByRole("dialog", { name: "Choose a date range" })
    .locator("[ng-calendar]");
  await rangeCalendar.locator(`[data-value="2026-09-10"]`).first().click();
  await rangeCalendar.locator(`[data-value="2026-09-12"]`).first().click();
  await expect(rangeTrigger).toContainText("Sep 10, 2026 - Sep 12, 2026");

  const subscription = page.locator("#date-picker-input");
  await subscription.fill("July 04, 2026");
  await subscription.blur();
  await expect(subscription).toHaveValue("July 04, 2026");

  const natural = page.locator("#date-picker-natural");
  await natural.fill("Tomorrow");
  await natural.blur();
  await expect(page.locator(".calendar-workflow-output")).toContainText(
    "September 11, 2026",
  );

  const time = page.locator("#date-picker-time-value");
  await time.fill("14:45:00");
  await expect(time).toHaveValue("14:45:00");

  const rtlCalendar = page
    .locator(
      `:is([data-slot=popover-content], [ng-popover-content])[aria-label="اختر تاريخًا"]`,
    )
    .locator("[ng-calendar]");
  await expect(rtlCalendar).toHaveAttribute("data-direction", "rtl");
});

test("docs iframe examples render without stale AngularTS bindings", async ({
  context,
  page: initialPage,
}) => {
  test.setTimeout(60_000);
  const failures: string[] = [];
  let page = initialPage;

  for (const [index, file] of componentExampleFiles.entries()) {
    if (index > 0 && index % 20 === 0) {
      await page.close();
      page = await context.newPage();
    }
    const examplePath = `/docs/static/${relative("docs/static", file)}`;
    const errors: string[] = [];
    page.removeAllListeners("pageerror");
    page.on("pageerror", (error) => errors.push(error.message));

    const response = await page.goto(examplePath, {
      timeout: 10_000,
      waitUntil: "domcontentloaded",
    });
    await page.waitForLoadState("load", { timeout: 10_000 });
    const result = await page.evaluate(() => {
      const text = document.body.innerText.trim();
      const usesAngular = document.body.hasAttribute("ng-app");
      const htmlOverflow = getComputedStyle(document.documentElement).overflow;
      const bodyOverflow = getComputedStyle(document.body).overflow;
      const scriptSources = Array.from(
        document.querySelectorAll("script[src]"),
        (script) => script.getAttribute("src") ?? "",
      );
      const stylesheetSources = Array.from(
        document.querySelectorAll('link[rel="stylesheet"][href]'),
        (link) => link.getAttribute("href") ?? "",
      );
      const legacySwitchAttributes = Array.from(
        document.body.querySelectorAll(
          "[ng-switch], [ngswitch], [ng-switch-when], [ngswitchwhen], [ng-switch-default], [ngswitchdefault]",
        ),
        (element) => element.outerHTML,
      );
      return {
        bodyOverflow,
        hasAngular: Boolean(window.angular),
        htmlOverflow,
        hasAccessibleName: Boolean(
          document.body.querySelector('[aria-label], img[alt]:not([alt=""])'),
        ),
        legacySwitchAttributes,
        scriptSources,
        stylesheetSources,
        text,
        usesAngular,
      };
    });

    if ((response?.status() ?? 0) >= 400) {
      failures.push(`${examplePath}: HTTP ${response?.status()}`);
    }

    if (errors.length) {
      failures.push(`${examplePath}: ${errors.join("; ")}`);
    }

    if (!result.text && !result.hasAccessibleName) {
      failures.push(`${examplePath}: rendered no visible text or label`);
    }

    if (result.text.includes("{{")) {
      failures.push(`${examplePath}: contains unresolved AngularTS binding`);
    }

    if (result.usesAngular && !result.hasAngular) {
      failures.push(
        `${examplePath}: ng-app rendered without AngularTS runtime`,
      );
    }

    if (!result.usesAngular) {
      failures.push(`${examplePath}: iframe example must use ng-app="ui"`);
    }

    const remoteScripts = result.scriptSources.filter(
      (src) => /^(?:https?:)?\/\//i.test(src) || /\bcdn\b/i.test(src),
    );
    const remoteStylesheets = result.stylesheetSources.filter(
      (src) => /^(?:https?:)?\/\//i.test(src) || /\bcdn\b/i.test(src),
    );

    if (remoteScripts.length) {
      failures.push(
        `${examplePath}: loads non-local scripts: ${remoteScripts.join(", ")}`,
      );
    }

    if (remoteStylesheets.length) {
      failures.push(
        `${examplePath}: loads non-local stylesheets: ${remoteStylesheets.join(", ")}`,
      );
    }

    const requiredStylesheets = [
      "tailwind-preflight.css",
      "angular.css",
      "example.css",
    ];

    for (const stylesheet of requiredStylesheets) {
      if (!result.stylesheetSources.some((src) => src.endsWith(stylesheet))) {
        failures.push(`${examplePath}: does not load ${stylesheet}`);
      }
    }

    if (
      result.usesAngular &&
      !result.scriptSources.some((src) => src.endsWith("angular-ts.umd.js"))
    ) {
      failures.push(`${examplePath}: ng-app does not load bundled AngularTS`);
    }

    if (
      result.usesAngular &&
      !result.scriptSources.some((src) => src.endsWith("angular-css.umd.js"))
    ) {
      failures.push(`${examplePath}: ng-app does not load bundled AngularCSS`);
    }

    if (result.legacySwitchAttributes.length) {
      failures.push(`${examplePath}: uses AngularTS-owned ng-switch markup`);
    }

    if (result.htmlOverflow !== "hidden" || result.bodyOverflow !== "hidden") {
      failures.push(`${examplePath}: iframe example can become scrollable`);
    }
  }

  expect(failures).toEqual([]);
});

test("form examples preserve AngularTS ng-model ownership", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/components/input.html");
  const search = page.locator("#docs-input-search");
  await search.fill("semantic");
  await expect(page.locator(".output").first()).toContainText(
    "Value: semantic",
  );
  await expect(search).toHaveValue("semantic");
  await expect(search).toHaveClass(/ng-not-empty/);

  await page.goto("/docs/static/examples/components/slider.html");
  const volume = page.locator("#volume");
  await volume.fill("42");
  await expect(page.locator('output[for="volume"]')).toHaveText("42");
  await expect(volume).toHaveAttribute("data-value", "42");
  await expect(volume).toHaveAttribute("aria-valuenow", "42");

  await page.goto("/docs/static/examples/components/checkbox.html");
  const terms = page.locator("#terms-checkbox");
  await expect(page.getByRole("status")).toContainText("Terms not accepted");
  await terms.check();
  await expect(page.getByRole("status")).toContainText("Terms accepted");
  await expect(terms).toBeChecked();

  await page.goto("/docs/static/examples/components/switch.html");
  const mode = page.locator("#airplane-mode");
  await expect(page.locator(".output").first()).toContainText(
    "Mode enabled: false",
  );
  await mode.check();
  await expect(page.locator(".output").first()).toContainText(
    "Mode enabled: true",
  );
  await expect(mode).toBeChecked();

  await page.goto("/docs/static/examples/components/textarea.html");
  const message = page.locator("#docs-textarea-message");
  await message.fill("Accessible components");
  await expect(page.locator(".output").first()).toContainText(
    "Message: Accessible components",
  );
  await expect(message).toHaveValue("Accessible components");

  await page.goto("/docs/static/examples/components/native-select.html");
  const status = page.getByLabel("Status");
  await status.selectOption("done");
  await expect(status).toHaveValue("done");

  await page.goto("/docs/static/examples/components/radio-group.html");
  const compact = page.locator("#density-compact");
  await compact.check();
  await expect(page.locator(".output").first()).toContainText(
    "Selected: compact",
  );
  await expect(compact).toBeChecked();

  await page.goto("/docs/static/examples/components/input-otp.html");
  const otpInputs = page.locator(
    ":is([data-slot=input-otp-slot], [ng-input-otp-slot]) input",
  );
  await expect(otpInputs).toHaveCount(6);
  await otpInputs.nth(0).fill("9");
  await expect(page.getByRole("status")).toContainText("Code: 923456");

  await page.goto("/docs/static/examples/components/field.html");
  const email = page.locator("#demo-profile-email");
  await expect(email).toHaveAttribute("aria-describedby", /field-message-/);
  await email.fill("jane@example.com");
  await expect(page.locator("[ng-field]").nth(1)).toHaveAttribute(
    "data-invalid",
    "false",
  );
  await expect(page.locator(".output").first()).toContainText(
    "jane@example.com",
  );

  await page.goto("/docs/static/examples/components/select.html");
  await page
    .locator(":is([data-slot=select-trigger], [ng-select-trigger])")
    .click();
  await page
    .locator(
      ":is([data-slot=select-item], [ng-select-item])[data-value='pineapple']",
    )
    .click();
  await expect(page.locator(".output").first()).toContainText(
    "Selected: pineapple",
  );
});
