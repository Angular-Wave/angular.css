import { expect, test, type Page } from "@playwright/test";

const canonicalUrl = "/docs/static/examples/components/calendar.html";
const workflowsUrl = "/docs/static/examples/components/calendar-workflows.html";
const compositionsUrl =
  "/docs/static/examples/components/calendar-compositions.html";
const datePickersUrl =
  "/docs/static/examples/components/date-picker-workflows.html";
const dropdownDatePickerUrl =
  "/docs/static/examples/components/date-picker-with-dropdowns.html";

const day = (page: Page, value: string) =>
  page.locator(`[ng-calendar] > div button[value="${value}"]`);

const expectBuiltArtifactRuntime = async (
  page: Page,
  includeDatePickerAdapter = false,
): Promise<void> => {
  await expect(
    page.locator('script[src$="/js/angular-ts.umd.js"]'),
  ).toHaveCount(1);
  await expect(
    page.locator('script[src$="/js/angular-css.umd.js"]'),
  ).toHaveCount(1);
  await expect(page.locator('link[href$="/css/angular.css"]')).toHaveCount(1);
  if (includeDatePickerAdapter) {
    await expect(
      page.locator('script[src$="/js/date-picker-demo.umd.js"]'),
    ).toHaveCount(1);
  }
  expect(
    await page.evaluate(() =>
      performance
        .getEntriesByType("resource")
        .map((entry) => entry.name)
        .filter((url) => /\/src\/(?:components|elements)\/.*\.ts$/.test(url)),
    ),
  ).toEqual([]);
};

test("canonical artifact generates a complete navigable calendar", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  await expectBuiltArtifactRuntime(page);

  const calendar = page.locator("[ng-calendar]");
  const days = calendar.locator(":scope > div button[value]");
  await expect(days).toHaveCount(42);
  await expect(calendar.locator(":scope > div abbr")).toHaveCount(7);
  await expect(calendar).not.toHaveAttribute("role");
  await expect(days.first()).not.toHaveAttribute("role");
  await expect(
    calendar.locator(
      ".calendar-header, .calendar-title, .calendar-grid, .calendar-day, .calendar-weekday, .calendar-previous, .calendar-next",
    ),
  ).toHaveCount(0);
  await expect(page.getByRole("combobox", { name: "Month" })).toHaveValue("4");
  await expect(page.getByRole("combobox", { name: "Year" })).toHaveValue(
    "2026",
  );
  await expect(day(page, "2026-05-14")).toHaveAttribute(
    "aria-selected",
    "true",
  );

  await day(page, "2026-05-20").click();
  await expect(calendar).toHaveAttribute("data-value", "2026-05-20");
  await expect(page.locator(".output")).toHaveText("Selected: 2026-05-20");

  await page.getByRole("button", { name: "Next month" }).click();
  await expect(calendar).toHaveAttribute("data-month", "2026-06");
  await expect(page.getByRole("combobox", { name: "Month" })).toHaveValue("5");
  await expect(days).toHaveCount(42);

  const outside = day(page, "2026-07-01");
  await expect(outside).toHaveAttribute("data-outside", "true");
  await outside.click();
  await expect(calendar).toHaveAttribute("data-month", "2026-07");
  await expect(calendar).toHaveAttribute("data-value", "2026-07-01");

  await day(page, "2026-07-15").focus();
  await page.keyboard.press("PageUp");
  await expect(calendar).toHaveAttribute("data-month", "2026-06");
  await expect(day(page, "2026-06-15")).toBeFocused();
  await expect(day(page, "2026-06-15")).toHaveAttribute(
    "aria-selected",
    "true",
  );
});

test("workflow artifact covers booked, caption, multiple, range, and week-number options", async ({
  page,
}) => {
  await page.setViewportSize({ height: 1900, width: 900 });
  await page.goto(workflowsUrl);
  await expectBuiltArtifactRuntime(page);

  const calendars = page.locator("[ng-calendar]");
  await expect(calendars).toHaveCount(6);
  for (let index = 0; index < 6; index += 1) {
    await expect(
      calendars.nth(index).locator(":scope > div button[value]"),
    ).toHaveCount(index === 4 ? 84 : 42);
  }

  const booked = calendars.nth(1);
  await expect(booked.locator('[data-booked="true"]')).toHaveCount(15);
  await expect(booked.locator('[value="2026-09-10"]')).toBeDisabled();

  const caption = calendars.nth(2);
  await expect(caption.getByRole("combobox", { name: "Month" })).toHaveValue(
    "8",
  );
  await caption.getByRole("combobox", { name: "Month" }).selectOption("9");
  await expect(caption).toHaveAttribute("data-month", "2026-10");

  const multiple = calendars.nth(3);
  await expect(multiple.locator('[aria-selected="true"]')).toHaveCount(2);
  await multiple.locator('[value="2026-09-14"]').click();
  await expect(multiple).toHaveAttribute(
    "data-values",
    '["2026-09-10","2026-09-12","2026-09-14"]',
  );
  await expect(page.locator(".calendar-workflow-output").nth(3)).toContainText(
    "2026-09-14",
  );

  const range = calendars.nth(4);
  const monthBoxes = await range
    .locator(":scope > div > section")
    .evaluateAll((months) =>
      months.map((month) => {
        const box = month.getBoundingClientRect();
        return { width: box.width, x: box.x };
      }),
    );
  expect(monthBoxes).toHaveLength(2);
  expect(monthBoxes[1].x).toBeGreaterThan(
    monthBoxes[0].x + monthBoxes[0].width,
  );
  await range.locator('[value="2026-09-20"]').click();
  await range.locator('[value="2026-09-23"]').click();
  await expect(range).toHaveAttribute("data-range-start-value", "2026-09-20");
  await expect(range).toHaveAttribute("data-range-end-value", "2026-09-23");
  await expect(page.locator(".calendar-workflow-output").nth(4)).toContainText(
    "2026-09-20 to 2026-09-23",
  );

  await expect(calendars.nth(5).locator(":scope > div data")).toHaveCount(6);
});

test("composition artifact preserves custom content, presets, time, RTL, and authored calendar adapters", async ({
  page,
}) => {
  await page.setViewportSize({ height: 1800, width: 1100 });
  await page.goto(compositionsUrl);
  await expectBuiltArtifactRuntime(page);

  const calendars = page.locator("[ng-calendar]");
  await expect(calendars).toHaveCount(5);
  await expect(
    calendars.nth(0).locator('[value="2026-09-12"] span'),
  ).toHaveText("$120");
  await calendars.nth(0).locator('[value="2026-09-20"]').click();
  await calendars.nth(0).locator('[value="2026-09-23"]').click();
  await expect(page.locator(".calendar-workflow-output").nth(0)).toContainText(
    "2026-09-20 to 2026-09-23",
  );

  await page.getByRole("button", { name: "In a week" }).click();
  await expect(calendars.nth(1)).toHaveAttribute("data-value", "2026-09-19");
  await expect(page.locator(".calendar-workflow-output").nth(1)).toContainText(
    "2026-09-19",
  );

  await page.getByLabel("Start time").fill("10:30");
  await expect(page.locator(".calendar-workflow-output").nth(2)).toContainText(
    "10:30",
  );
  await expect(calendars.nth(3)).toHaveCSS("direction", "rtl");
  await expect(calendars.nth(4)).toHaveAttribute("aria-label", "خرداد ۱۴۰۴");
  await expect(
    calendars.nth(4).locator(":scope > div button[value]"),
  ).toHaveCount(42);
});

test("Date Picker basic, demo, and date-of-birth compositions use real popovers and calendars", async ({
  page,
}) => {
  await page.goto(datePickersUrl);
  await expectBuiltArtifactRuntime(page, true);
  await expect(page.locator("[ng-calendar]")).toHaveCount(8);

  const basic = page.locator("#date-picker-basic-popover");
  const basicContent = basic.locator(":scope > [popover]");
  await page.locator("#date-picker-basic").click();
  await expect(basicContent).toBeVisible();
  await basic.locator('[value="2026-09-12"]').click();
  await expect(page.locator("#date-picker-basic")).toContainText(
    "September 12, 2026",
  );
  await expect(basicContent).toBeVisible();

  const demo = page.locator("#date-picker-demo-popover");
  await demo.locator(":scope > button:first-child").click();
  await demo.locator('[value="2026-09-13"]').click();
  await expect(demo.locator(":scope > button:first-child")).toContainText(
    "September 13, 2026",
  );
  await expect(demo.locator(":scope > [popover]")).toBeVisible();

  const dob = page.locator("#date-picker-dob-popover");
  await page.locator("#date-picker-dob").click();
  await expect(dob.getByRole("combobox", { name: "Year" })).toBeVisible();
  await dob.locator('[value="2026-09-14"]').click();
  await expect(page.locator("#date-picker-dob")).toContainText(
    "September 14, 2026",
  );
  await expect(dob.locator(":scope > [popover]")).toBeHidden();
});

test("Date Picker dropdown composition keeps selection open until Done", async ({
  page,
}) => {
  await page.setViewportSize({ height: 680, width: 720 });
  await page.goto(dropdownDatePickerUrl);
  await expectBuiltArtifactRuntime(page, true);

  const popover = page.locator("#date-picker-dropdown-popover");
  const content = popover.locator(":scope > [popover]");
  await page.locator("#date-picker-with-dropdowns").click();
  await expect(content).toBeVisible();
  await expect(popover.getByRole("combobox", { name: "Month" })).toBeVisible();
  await expect(popover.getByRole("combobox", { name: "Year" })).toBeVisible();
  await popover.locator('[value="2026-09-16"]').click();
  await expect(page.locator("#date-picker-with-dropdowns")).toContainText(
    "September 16, 2026",
  );
  await expect(content).toBeVisible();
  await expect(page.locator(".date-picker-dropdown-demo")).toHaveScreenshot(
    "date-picker-with-dropdowns-open-desktop.png",
    { animations: "disabled" },
  );
  await page.getByRole("button", { name: "Done" }).click();
  await expect(content).toBeHidden();
  await expect(page.locator("#date-picker-with-dropdowns")).toBeFocused();
});

test("Date Picker text and natural-language inputs synchronize through AngularTS", async ({
  page,
}) => {
  await page.goto(datePickersUrl);

  const input = page.getByRole("textbox", { name: "Subscription Date" });
  await input.fill("October 05, 2026");
  await input.press("ArrowDown");
  const inputPopover = page.locator("#date-picker-input-popover");
  await expect(inputPopover.locator(":scope > [popover]")).toBeVisible();
  await expect(inputPopover.locator("[ng-calendar]")).toHaveAttribute(
    "data-month",
    "2026-10",
  );
  await inputPopover.locator('[value="2026-10-06"]').click();
  await expect(input).toHaveValue("October 06, 2026");
  await expect(inputPopover.locator(":scope > [popover]")).toBeHidden();

  const natural = page.getByRole("textbox", { name: "Schedule Date" });
  await natural.fill("October 5, 2026");
  await expect(page.getByText(/Your post will be published on/)).toContainText(
    "October 5, 2026",
  );
  await natural.press("ArrowDown");
  const naturalPopover = page.locator("#date-picker-natural-popover");
  await expect(naturalPopover.locator("[ng-calendar]")).toHaveAttribute(
    "data-month",
    "2026-10",
  );
  await naturalPopover.locator('[value="2026-10-06"]').click();
  await expect(natural).toHaveValue("October 06, 2026");
  await expect(naturalPopover.locator(":scope > [popover]")).toBeHidden();
});

test("Date Picker range, RTL, and time compositions remain functional and contained", async ({
  page,
}) => {
  await page.setViewportSize({ height: 900, width: 1100 });
  await page.goto(datePickersUrl);

  const range = page.locator("#date-picker-range-popover");
  await page.locator("#date-picker-range").click();
  const rangeCalendar = range.locator("[ng-calendar]");
  await expect(rangeCalendar.locator(":scope > div > section")).toHaveCount(2);
  await rangeCalendar.locator('[value="2026-09-20"]').click();
  await rangeCalendar.locator('[value="2026-09-23"]').click();
  await expect(page.locator("#date-picker-range")).toContainText(
    "Sep 20, 2026 - Sep 23, 2026",
  );
  await expect(range.locator(":scope > [popover]")).toBeVisible();

  await page.keyboard.press("Escape");
  const rtl = page.locator("#date-picker-rtl-popover");
  await rtl.locator(":scope > button:first-child").click();
  await expect(rtl.locator("[ng-calendar]")).toHaveCSS("direction", "rtl");
  await expect(rtl.locator("[ng-calendar] > div abbr").first()).toContainText(
    "ح",
  );

  await page.keyboard.press("Escape");
  const time = page.locator("#date-picker-time-popover");
  await page.locator("#date-picker-time-date").click();
  await time.locator('[value="2026-09-12"]').click();
  await expect(page.locator("#date-picker-time-date")).toContainText(
    "Sep 12, 2026",
  );
  await expect(time.locator(":scope > [popover]")).toBeHidden();
  await page.locator("#date-picker-time-value").fill("11:45:30");
  await expect(page.locator("#date-picker-time-value")).toHaveValue("11:45:30");

  const metrics = await page.evaluate(() => ({
    body: document.body.scrollWidth,
    viewport: document.documentElement.clientWidth,
  }));
  expect(metrics.body).toBeLessThanOrEqual(metrics.viewport);
});

test("Date Picker layouts remain non-overlapping at the mobile breakpoint", async ({
  page,
}) => {
  await page.setViewportSize({ height: 1800, width: 390 });
  await page.goto(datePickersUrl);
  const range = page.locator("#date-picker-range-popover");
  await page.locator("#date-picker-range").click();
  const months = range.locator("[ng-calendar] > div > section");
  await expect(months).toHaveCount(2);
  const boxes = await months.evaluateAll((elements) =>
    elements.map((element) => {
      const box = element.getBoundingClientRect();
      return { bottom: box.bottom, top: box.top };
    }),
  );
  expect(boxes[1].top).toBeGreaterThanOrEqual(boxes[0].bottom);
  const metrics = await page.evaluate(() => ({
    body: document.body.scrollWidth,
    viewport: document.documentElement.clientWidth,
  }));
  expect(metrics.body).toBeLessThanOrEqual(metrics.viewport);
});
