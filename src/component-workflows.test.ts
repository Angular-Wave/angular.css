import { expect, test } from "@playwright/test";

test("button workflows preserve reference variants, sizes, loading, and RTL", async ({
  page,
}) => {
  await page.setViewportSize({ height: 520, width: 900 });
  await page.goto("/docs/static/examples/components/button-workflows.html");

  const sizePairs = [
    ["Extra Small", "Submit extra small", 24],
    ["Small", "Submit small", 32],
    ["Default", "Submit default", 36],
    ["Large", "Submit large", 40],
  ] as const;
  for (const [textName, iconName, expectedHeight] of sizePairs) {
    const textBox = await page
      .getByRole("button", { name: textName, exact: true })
      .boundingBox();
    const iconBox = await page
      .getByRole("button", { name: iconName, exact: true })
      .boundingBox();
    expect(textBox).not.toBeNull();
    expect(iconBox).not.toBeNull();
    expect(textBox!.height).toBeCloseTo(expectedHeight, 0);
    expect(iconBox).toMatchObject({
      height: expectedHeight,
      width: expectedHeight,
    });
  }

  await expect(page.getByRole("button", { name: "Generating" })).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Downloading" }),
  ).toBeDisabled();
  await expect(page.getByRole("status")).toHaveCount(2);
  await expect(page.getByLabel("RTL buttons")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("button", { name: "Get Started" })).toHaveCSS(
    "border-radius",
    "9999px",
  );
  const login = page.getByRole("link", { name: "Login" });
  await expect(login).toHaveAttribute("href", "#login");
  await expect(login).toHaveAttribute("data-variant", "secondary");
  expect((await login.boundingBox())!.height).toBeCloseTo(32, 0);
  await expect(page.locator(".workflow-stack")).toHaveScreenshot(
    "button-workflows-desktop.png",
    { animations: "disabled" },
  );
});

test("badge workflows preserve link, icon, loading, and RTL compositions", async ({
  page,
}) => {
  await page.setViewportSize({ height: 420, width: 900 });
  await page.goto("/docs/static/examples/components/badge-workflows.html");

  const badges = page.locator("[ng-badge]");
  await expect(badges).toHaveCount(19);
  expect(
    await badges.evaluateAll((items) =>
      items.map((item) => item.getBoundingClientRect().height),
    ),
  ).toEqual(Array(19).fill(20));
  const customColors = page
    .getByLabel("Badge custom colors")
    .locator("[ng-badge]");
  const colors = await customColors.evaluateAll((items) =>
    items.map((item) => {
      const style = getComputedStyle(item);
      const tokenName = item.className.replace("badge-color-", "");
      const token =
        tokenName === "sky"
          ? "cyan"
          : tokenName === "purple"
            ? "violet"
            : tokenName;
      const probe = document.createElement("span");
      probe.style.background = `var(--${token}-2)`;
      probe.style.color = `var(--${token}-11)`;
      document.body.append(probe);
      const expected = getComputedStyle(probe);
      const result = {
        background: style.backgroundColor,
        color: style.color,
        expectedBackground: expected.backgroundColor,
        expectedColor: expected.color,
      };
      probe.remove();
      return result;
    }),
  );
  for (const color of colors) {
    expect(color.background).toBe(color.expectedBackground);
    expect(color.color).toBe(color.expectedColor);
  }
  await expect(page.getByRole("link", { name: "Open Link" })).toHaveAttribute(
    "href",
    "#link",
  );
  await expect(page.getByRole("status")).toHaveCount(2);
  await expect(page.getByLabel("RTL badges")).toHaveAttribute("dir", "rtl");
  await expect(page.locator(".workflow-stack")).toHaveScreenshot(
    "badge-workflows-desktop.png",
    { animations: "disabled" },
  );
});

test("spinner workflows retain size inside composed components", async ({
  page,
}) => {
  await page.setViewportSize({ height: 680, width: 900 });
  await page.goto("/docs/static/examples/components/spinner-workflows.html");

  const sizeRow = page.getByLabel("Spinner sizes").locator("[ng-spinner]");
  expect(
    await sizeRow.evaluateAll((items) =>
      items.map((item) => getComputedStyle(item).width),
    ),
  ).toEqual(["12px", "16px", "24px", "32px"]);

  const loadingButtons = page.getByLabel("Spinner buttons").getByRole("button");
  await expect(loadingButtons).toHaveCount(3);
  for (const button of await loadingButtons.all()) {
    await expect(button).toBeDisabled();
  }

  await expect(page.locator(".spinner-empty-demo [ng-spinner]")).toHaveCSS(
    "width",
    "16px",
  );
  await expect(
    page.getByLabel("Spinner input groups").locator("[ng-input-group]"),
  ).toHaveCount(2);
  await expect(page.locator(".spinner-rtl-demo")).toHaveAttribute("dir", "rtl");
  await expect(page.locator("[ng-spinner]")).toHaveCount(14);
  await expect(page.locator(".spinner-empty-demo")).toHaveAttribute(
    "role",
    "status",
  );
  await expect(page.locator(".spinner-workflows")).toHaveScreenshot(
    "spinner-workflows-desktop.png",
    { animations: "disabled" },
  );
});

test("accordion state workflows preserve basic, disabled, and multiple behavior", async ({
  page,
}) => {
  await page.setViewportSize({ height: 760, width: 900 });
  await page.goto(
    "/docs/static/examples/components/accordion-state-workflows.html",
  );

  const basicTrigger = page.getByRole("button", {
    name: "How do I reset my password?",
  });
  await expect(basicTrigger).toHaveAttribute("aria-expanded", "true");
  await basicTrigger.click();
  await expect(basicTrigger).toHaveAttribute("aria-expanded", "false");

  const disabledTrigger = page.getByRole("button", {
    name: "Premium feature information",
  });
  await expect(disabledTrigger).toBeDisabled();
  await expect(disabledTrigger).toHaveAttribute("aria-expanded", "false");

  const notificationTrigger = page.getByRole("button", {
    name: "Notification Settings",
  });
  const privacyTrigger = page.getByRole("button", {
    name: "Privacy & Security",
  });
  await expect(notificationTrigger).toHaveAttribute("aria-expanded", "true");
  await privacyTrigger.click();
  await expect(notificationTrigger).toHaveAttribute("aria-expanded", "true");
  await expect(privacyTrigger).toHaveAttribute("aria-expanded", "true");

  await basicTrigger.click();
  await expect(basicTrigger).toHaveAttribute("aria-expanded", "true");
  await page.mouse.move(890, 750);

  await expect(page.locator(".accordion-workflow-grid")).toHaveScreenshot(
    "accordion-state-workflows-desktop.png",
    { animations: "disabled" },
  );
});

test("accordion layout workflows preserve borders, card composition, and RTL", async ({
  page,
}) => {
  await page.setViewportSize({ height: 780, width: 900 });
  await page.goto(
    "/docs/static/examples/components/accordion-layout-workflows.html",
  );

  await expect(page.locator(".accordion-bordered")).toHaveCSS(
    "border-top-width",
    "1px",
  );
  const { borderColor, tokenColor } = await page
    .locator(".accordion-bordered")
    .evaluate((element) => {
      const probe = document.createElement("span");
      probe.style.color = "var(--border)";
      document.body.append(probe);
      const borderColor = getComputedStyle(element).borderTopColor;
      const tokenColor = getComputedStyle(probe).color;
      probe.remove();
      return { borderColor, tokenColor };
    });
  expect(borderColor).toBe(tokenColor);
  await expect(page.locator(":is([data-slot=card], [ng-card])")).toBeVisible();

  const rtlSection = page.locator("[dir='rtl']");
  await expect(rtlSection).toHaveAttribute("lang", "ar");
  const rtlTrigger = rtlSection.getByRole("button", {
    name: "كيف يمكنني إعادة تعيين كلمة المرور؟",
  });
  const triggerBox = await rtlTrigger.boundingBox();
  const iconBox = await rtlTrigger
    .locator(
      ":is([data-slot=accordion-trigger-icon], [ng-accordion-trigger-icon])",
    )
    .boundingBox();
  expect(triggerBox).not.toBeNull();
  expect(iconBox).not.toBeNull();
  expect(iconBox!.x).toBeLessThan(triggerBox!.x + triggerBox!.width / 2);

  const secondRtlTrigger = rtlSection.getByRole("button", {
    name: "هل يمكنني تغيير خطة الاشتراك الخاصة بي؟",
  });
  await secondRtlTrigger.click();
  await expect(rtlTrigger).toHaveAttribute("aria-expanded", "false");
  await expect(secondRtlTrigger).toHaveAttribute("aria-expanded", "true");

  await rtlTrigger.click();
  await expect(rtlTrigger).toHaveAttribute("aria-expanded", "true");
  await expect(secondRtlTrigger).toHaveAttribute("aria-expanded", "false");
  await page.mouse.move(890, 770);

  await expect(page.locator(".accordion-workflow-grid")).toHaveScreenshot(
    "accordion-layout-workflows-desktop.png",
    { animations: "disabled" },
  );
});

test("dropdown workflows preserve dynamic, model, submenu, icon, disabled, and RTL states", async ({
  page,
}) => {
  await page.setViewportSize({ height: 900, width: 900 });
  await page.goto("/docs/static/examples/components/dropdown-workflows.html");

  await page.getByRole("button", { name: "Add archive item" }).click();
  await expect(page.locator("#dropdown-archive-item")).toHaveAttribute(
    "role",
    "menuitem",
  );

  const preferences = page.locator("#dropdown-preferences-title").locator("..");
  await preferences.getByRole("button", { name: "Notifications" }).click();
  await expect(preferences.getByRole("menu")).toBeVisible();

  const rtlRoot = page.getByLabel("Arabic account menu");
  await expect(rtlRoot).toHaveAttribute("data-direction", "rtl");
  await page.mouse.move(890, 890);
  await expect(page.locator(".dropdown-workflow-grid")).toHaveScreenshot(
    "dropdown-workflows-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 1380, width: 390 });
  await page.reload();
  const actions = page.locator("#dropdown-actions-title").locator("..");
  await actions.getByRole("button", { name: "Actions" }).click();
  const subTrigger = actions.getByRole("menuitem", { name: "Invite users" });
  await subTrigger.focus();
  await subTrigger.press("ArrowRight");
  await expect(
    actions.locator('[data-slot="dropdown-menu-sub-content"]'),
  ).toBeVisible();
  await page.mouse.move(380, 1370);
  await expect(page.locator(".dropdown-workflow-grid")).toHaveScreenshot(
    "dropdown-workflows-mobile.png",
    { animations: "disabled" },
  );
});

test("hover card workflows preserve physical sides, mobile framing, and RTL", async ({
  page,
}) => {
  await page.setViewportSize({ height: 680, width: 900 });
  await page.goto("/docs/static/examples/components/hover-card-workflows.html");
  await page.getByRole("button", { name: "Left", exact: true }).hover();
  await expect(
    page
      .getByRole("button", { name: "Left", exact: true })
      .locator("..")
      .locator("[ng-hover-card-content]"),
  ).toBeVisible();
  await expect(page.locator(".hover-card-workflow")).toHaveScreenshot(
    "hover-card-sides-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 1040, width: 390 });
  await page.reload();
  await page.getByRole("button", { name: "Bottom", exact: true }).hover();
  await expect(
    page
      .getByRole("button", { name: "Bottom", exact: true })
      .locator("..")
      .locator("[ng-hover-card-content]"),
  ).toBeVisible();
  await expect(page.locator(".hover-card-workflow")).toHaveScreenshot(
    "hover-card-sides-mobile.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 680, width: 900 });
  await page.goto("/docs/static/examples/components/hover-card-rtl.html");
  await page.getByRole("button", { name: "أعلى", exact: true }).hover();
  const rtlContent = page
    .getByRole("button", { name: "أعلى", exact: true })
    .locator("..")
    .locator("[ng-hover-card-content]");
  await expect(rtlContent).toBeVisible();
  await expect(rtlContent).toHaveAttribute("data-direction", "rtl");
  await expect(page.locator(".hover-card-workflow")).toHaveScreenshot(
    "hover-card-rtl-desktop.png",
    { animations: "disabled" },
  );
});

test("popover examples preserve Nova surfaces, alignment, mobile framing, and RTL", async ({
  page,
}) => {
  await page.setViewportSize({ height: 560, width: 900 });
  await page.goto("/docs/static/examples/components/popover.html");
  await page.getByRole("button", { name: "Open popover" }).click();
  await expect(page.locator(".popover-demo")).toHaveScreenshot(
    "popover-demo-open-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 760, width: 900 });
  await page.goto("/docs/static/examples/components/popover-workflows.html");
  await page.getByRole("button", { name: "Edit dimensions" }).click();
  await expect(page.locator(".popover-workflows")).toHaveScreenshot(
    "popover-workflows-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 1200, width: 390 });
  await page.reload();
  await page.getByRole("button", { name: "Center", exact: true }).click();
  await expect(page.locator(".popover-workflows")).toHaveScreenshot(
    "popover-workflows-mobile.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 560, width: 900 });
  await page.goto("/docs/static/examples/components/popover-rtl.html");
  await page.getByRole("button", { name: "أعلى", exact: true }).click();
  const rtlContent = page
    .getByRole("button", { name: "أعلى", exact: true })
    .locator("..")
    .locator("[ng-popover-content]");
  await expect(rtlContent).toHaveAttribute("data-direction", "rtl");
  await expect(page.locator(".popover-rtl-workflow")).toHaveScreenshot(
    "popover-rtl-desktop.png",
    { animations: "disabled" },
  );
});

test("tooltip examples preserve Nova arrows, disabled wrappers, mobile sides, and RTL", async ({
  page,
}) => {
  await page.setViewportSize({ height: 360, width: 900 });
  await page.goto("/docs/static/examples/components/tooltip.html");
  await page.getByRole("button", { name: "Hover" }).hover();
  await expect(page.locator(".tooltip-demo")).toHaveScreenshot(
    "tooltip-demo-open-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 680, width: 900 });
  await page.goto("/docs/static/examples/components/tooltip-workflows.html");
  await page.getByRole("button", { name: "Save changes" }).focus();
  await expect(page.locator(".tooltip-workflows")).toHaveScreenshot(
    "tooltip-workflows-desktop.png",
    { animations: "disabled" },
  );

  const disabled = page.getByRole("button", { name: "Disabled" });
  await disabled.locator("..").hover();
  await expect(
    page.locator(".tooltip-workflow-section").nth(1),
  ).toHaveScreenshot("tooltip-disabled-open-desktop.png", {
    animations: "disabled",
  });

  await page.setViewportSize({ height: 1000, width: 390 });
  await page.reload();
  await page.getByRole("button", { name: "Bottom", exact: true }).hover();
  await expect(page.locator(".tooltip-workflows")).toHaveScreenshot(
    "tooltip-workflows-mobile.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 360, width: 900 });
  await page.goto("/docs/static/examples/components/tooltip-rtl.html");
  await page.getByRole("button", { name: "أعلى", exact: true }).hover();
  await expect(page.locator(".tooltip-rtl-workflow")).toHaveScreenshot(
    "tooltip-rtl-desktop.png",
    { animations: "disabled" },
  );
});

test("menubar examples preserve compact surfaces, state items, submenus, mobile framing, and RTL", async ({
  page,
}) => {
  await page.setViewportSize({ height: 420, width: 900 });
  await page.goto("/docs/static/examples/components/menubar.html");
  await page.getByRole("menuitem", { name: "File", exact: true }).click();
  await expect(page.locator(".menubar-demo")).toHaveScreenshot(
    "menubar-demo-open-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 1100, width: 900 });
  await page.goto("/docs/static/examples/components/menubar-workflows.html");
  await page
    .getByRole("menubar", { name: "View preferences" })
    .getByRole("menuitem", { name: "View" })
    .click();
  await expect(page.locator(".menubar-workflows")).toHaveScreenshot(
    "menubar-workflows-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 2200, width: 390 });
  await page.reload();
  const commands = page.getByRole("menubar", { name: "Editing commands" });
  await commands.getByRole("menuitem", { name: "File" }).click();
  const share = commands.getByRole("menuitem", { name: "Share" });
  await share.focus();
  await share.press("ArrowRight");
  await expect(page.locator(".menubar-workflows")).toHaveScreenshot(
    "menubar-workflows-mobile.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 520, width: 900 });
  await page.goto("/docs/static/examples/components/menubar-rtl.html");
  await page.getByRole("menuitem", { name: "ملف", exact: true }).click();
  await expect(page.locator(".menubar-rtl-workflow")).toHaveScreenshot(
    "menubar-rtl-desktop.png",
    { animations: "disabled" },
  );
});

test("native select examples preserve Nova sizing, native states, mobile framing, and RTL", async ({
  page,
}) => {
  await page.setViewportSize({ height: 360, width: 900 });
  await page.goto("/docs/static/examples/components/native-select.html");
  await expect(page.locator(".native-select-demo")).toHaveScreenshot(
    "native-select-demo-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 720, width: 900 });
  await page.goto(
    "/docs/static/examples/components/native-select-workflows.html",
  );
  await page
    .getByRole("combobox", { name: "Department" })
    .selectOption("backend");
  await expect(page.locator(".native-select-workflows")).toHaveScreenshot(
    "native-select-workflows-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 920, width: 390 });
  await page.reload();
  await page.getByRole("button", { name: "Add archived option" }).click();
  await expect(page.locator(".native-select-workflows")).toHaveScreenshot(
    "native-select-workflows-mobile.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 420, width: 900 });
  await page.goto("/docs/static/examples/components/native-select-rtl.html");
  await page.getByRole("combobox", { name: "الحالة" }).selectOption("done");
  await expect(page.locator(".native-select-rtl-workflow")).toHaveScreenshot(
    "native-select-rtl-desktop.png",
    { animations: "disabled" },
  );
});

test("navigation menu examples preserve native navigation, flyouts, dynamic state, mobile framing, and RTL", async ({
  page,
}) => {
  await page.setViewportSize({ height: 560, width: 900 });
  await page.goto("/docs/static/examples/components/navigation-menu.html");
  await page.getByRole("button", { name: "Getting started" }).click();
  await expect(page.locator(".navigation-menu-demo")).toHaveScreenshot(
    "navigation-menu-demo-open-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 760, width: 900 });
  await page.goto(
    "/docs/static/examples/components/navigation-menu-workflows.html",
  );
  await page.getByRole("button", { name: "Toggle controlled panel" }).click();
  await page.getByRole("button", { name: "Add company menu" }).click();
  await page.getByRole("button", { name: "Add careers link" }).click();
  await expect(page.locator(".navigation-menu-workflows")).toHaveScreenshot(
    "navigation-menu-workflows-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 1100, width: 390 });
  await page.reload();
  await page.getByRole("button", { name: "Product" }).click();
  await expect(page.locator(".navigation-menu-workflows")).toHaveScreenshot(
    "navigation-menu-workflows-mobile.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 560, width: 900 });
  await page.goto("/docs/static/examples/components/navigation-menu-rtl.html");
  await page.getByRole("button", { name: "البدء" }).click();
  await expect(page.locator(".navigation-menu-demo")).toHaveScreenshot(
    "navigation-menu-rtl-desktop.png",
    { animations: "disabled" },
  );
});

test("pagination examples preserve Nova sizing, native links, AngularTS state, compact composition, mobile framing, and RTL", async ({
  page,
}) => {
  await page.setViewportSize({ height: 240, width: 900 });
  await page.goto("/docs/static/examples/components/pagination.html");
  await expect(page.locator(".pagination-demo")).toHaveScreenshot(
    "pagination-demo-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 420, width: 900 });
  await page.goto("/docs/static/examples/components/pagination-workflows.html");
  await page.getByRole("button", { name: "Add page 4" }).click();
  await page.getByRole("button", { name: "Disable next" }).click();
  await page
    .getByRole("combobox", { name: "Rows per page" })
    .selectOption("50");
  await expect(page.locator(".pagination-workflows")).toHaveScreenshot(
    "pagination-workflows-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 720, width: 390 });
  await page.reload();
  await expect(page.locator(".pagination-workflows")).toHaveScreenshot(
    "pagination-workflows-mobile.png",
    { animations: "disabled" },
  );
});

test("progress examples preserve Nova geometry, timed and controlled state, labels, mobile framing, and RTL", async ({
  page,
}) => {
  await page.setViewportSize({ height: 260, width: 900 });
  await page.goto("/docs/static/examples/components/progress.html");
  await expect(page.locator(".progress-demo-timed")).toHaveAttribute(
    "aria-valuenow",
    "66",
  );
  await page.waitForTimeout(200);
  await expect(page.locator(".progress-demo")).toHaveScreenshot(
    "progress-demo-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 420, width: 900 });
  await page.goto("/docs/static/examples/components/progress-workflows.html");
  await page.getByRole("slider", { name: "Progress value" }).fill("83");
  await expect(
    page.getByRole("progressbar", { name: "Controlled" }),
  ).toHaveAttribute("aria-valuenow", "83");
  await page.waitForTimeout(200);
  await expect(page.locator(".progress-workflows")).toHaveScreenshot(
    "progress-workflows-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 520, width: 390 });
  await page.reload();
  await expect(page.locator(".progress-workflows")).toHaveScreenshot(
    "progress-workflows-mobile.png",
    { animations: "disabled" },
  );
});

test("resizable examples preserve Nova nested, visible-handle, vertical, RTL, and mobile layouts", async ({
  page,
}) => {
  await page.setViewportSize({ height: 260, width: 900 });
  await page.goto("/docs/static/examples/components/resizable.html");
  await expect(page.locator(".resizable-demo")).toHaveScreenshot(
    "resizable-demo-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 500, width: 900 });
  await page.goto("/docs/static/examples/components/resizable-workflows.html");
  await expect(page.locator(".resizable-workflows")).toHaveScreenshot(
    "resizable-workflows-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 760, width: 390 });
  await page.reload();
  await expect(page.locator(".resizable-workflows")).toHaveScreenshot(
    "resizable-workflows-mobile.png",
    { animations: "disabled" },
  );
});

test("select examples preserve Nova popup, grouped, invalid, scrollable, mobile, and RTL visuals", async ({
  page,
}) => {
  await page.setViewportSize({ height: 360, width: 900 });
  await page.goto("/docs/static/examples/components/select.html");
  await page.getByRole("combobox", { name: "Fruit" }).click();
  await expect(page.locator(".select-demo")).toHaveScreenshot(
    "select-demo-open-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 820, width: 900 });
  await page.goto("/docs/static/examples/components/select-workflows.html");
  await page.getByRole("combobox", { name: "Produce" }).click();
  await expect(page.locator(".select-workflows")).toHaveScreenshot(
    "select-workflows-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 1420, width: 390 });
  await page.reload();
  await page.getByRole("combobox", { name: "Timezone" }).click();
  await expect(page.locator(".select-workflows")).toHaveScreenshot(
    "select-workflows-mobile.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 820, width: 900 });
  await page.goto("/docs/static/examples/components/select-workflows.html");
  await page.getByRole("combobox", { name: "الفاكهة" }).click();
  await expect(page).toHaveScreenshot("select-rtl-open-desktop.png", {
    animations: "disabled",
  });
});

test("combobox examples preserve Nova search, grouped, multiple, state, mobile, and RTL visuals", async ({
  page,
}) => {
  await page.setViewportSize({ height: 420, width: 900 });
  await page.goto("/docs/static/examples/components/combobox.html");
  await page.getByRole("combobox", { name: "Framework", exact: true }).focus();
  await expect(page.locator(".combobox-demo")).toHaveScreenshot(
    "combobox-demo-open-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 980, width: 900 });
  await page.goto("/docs/static/examples/components/combobox-workflows.html");
  await page.getByRole("combobox", { name: "Grouped timezone" }).fill("Tokyo");
  await expect(page.locator(".combobox-workflows")).toHaveScreenshot(
    "combobox-workflows-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 1500, width: 390 });
  await page.reload();
  await page.getByRole("combobox", { name: "Clearable framework" }).focus();
  await expect(page.locator(".combobox-workflows")).toHaveScreenshot(
    "combobox-workflows-mobile.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 600, width: 1100 });
  await page.goto(
    "/docs/static/examples/components/combobox-compositions.html",
  );
  await page
    .getByRole("combobox", { name: "Country with details" })
    .fill("Japan");
  await expect(page.locator(".combobox-compositions")).toHaveScreenshot(
    "combobox-compositions-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 1200, width: 390 });
  await page.reload();
  await page.getByRole("combobox", { name: "Frameworks" }).focus();
  await expect(page.locator(".combobox-compositions")).toHaveScreenshot(
    "combobox-compositions-mobile.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 440, width: 500 });
  await page.goto(
    "/docs/static/examples/components/combobox-compositions.html",
  );
  const rtl = page.locator("#rtl-combobox");
  await rtl.getByRole("combobox").focus();
  await rtl.scrollIntoViewIfNeeded();
  await expect(page).toHaveScreenshot("combobox-rtl-open-desktop.png", {
    animations: "disabled",
  });

  await page.setViewportSize({ height: 480, width: 500 });
  await page.goto(
    "/docs/static/examples/components/combobox-state-workflows.html",
  );
  await page.getByRole("button", { name: "Toggle popup" }).click();
  await expect(page.locator(".combobox-state-workflows")).toHaveScreenshot(
    "combobox-state-workflows-desktop.png",
    { animations: "disabled" },
  );
});

test("command examples preserve Nova standalone, dialog, scrollable, mobile, and RTL visuals", async ({
  page,
}) => {
  await page.setViewportSize({ height: 520, width: 900 });
  await page.goto("/docs/static/examples/components/command.html");
  await expect(page.locator(".command-demo")).toHaveScreenshot(
    "command-demo-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 980, width: 1000 });
  await page.goto(
    "/docs/static/examples/components/command-dialog-workflows.html",
  );
  await page.getByRole("button", { name: "Open Grouped Menu" }).click();
  await expect(page.locator(".command-dialog-workflows")).toHaveScreenshot(
    "command-dialog-workflows-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 1000, width: 390 });
  await page.reload();
  await page.getByRole("button", { name: "Open Menu", exact: true }).click();
  await expect(page.locator(".command-dialog-workflows")).toHaveScreenshot(
    "command-dialog-workflows-mobile.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 680, width: 900 });
  await page.goto("/docs/static/examples/components/command-scrollable.html");
  await page.getByRole("button", { name: "Open Menu" }).click();
  await expect(page.locator(".command-scrollable-demo")).toHaveScreenshot(
    "command-scrollable-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 520, width: 900 });
  await page.goto("/docs/static/examples/components/command-rtl.html");
  await expect(page.locator(".command-rtl-demo")).toHaveScreenshot(
    "command-rtl-desktop.png",
    { animations: "disabled" },
  );
});

test("context menu examples preserve pointer, state, side, mobile, and RTL visuals", async ({
  page,
}) => {
  await page.setViewportSize({ height: 560, width: 900 });
  await page.goto("/docs/static/examples/components/context-menu.html");
  await page
    .locator("[ng-context-menu-trigger]")
    .click({ button: "right", position: { x: 160, y: 40 } });
  await expect(page.locator(".context-menu-demo")).toHaveScreenshot(
    "context-menu-demo-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 920, width: 1000 });
  await page.goto(
    "/docs/static/examples/components/context-menu-workflows.html",
  );
  await page
    .getByRole("heading", { name: "Icons and destructive action" })
    .locator("..")
    .locator("[ng-context-menu-trigger]")
    .click({ button: "right" });
  await expect(page.locator(".context-menu-workflow-grid")).toHaveScreenshot(
    "context-menu-workflows-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 760, width: 900 });
  await page.goto("/docs/static/examples/components/context-menu-sides.html");
  await page
    .locator("[ng-context-menu-trigger]")
    .nth(2)
    .click({ button: "right" });
  await expect(page.locator(".context-menu-sides")).toHaveScreenshot(
    "context-menu-sides-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 500, width: 390 });
  await page.goto("/docs/static/examples/components/context-menu.html");
  await page.locator("[ng-context-menu-trigger]").click({ button: "right" });
  await expect(page.locator(".context-menu-demo")).toHaveScreenshot(
    "context-menu-demo-mobile.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 560, width: 900 });
  await page.goto("/docs/static/examples/components/context-menu-rtl.html");
  await page
    .locator("[ng-context-menu-trigger]")
    .first()
    .click({ button: "right" });
  await expect(page.locator(".context-menu-rtl-demo")).toHaveScreenshot(
    "context-menu-rtl-desktop.png",
    { animations: "disabled" },
  );
});

test("dialog examples preserve modal, close, scroll, mobile, and RTL visuals", async ({
  page,
}) => {
  await page.setViewportSize({ height: 560, width: 900 });
  await page.goto("/docs/static/examples/components/dialog.html");
  await page.getByRole("button", { name: "Edit profile" }).click();
  await expect(page).toHaveScreenshot("dialog-demo-desktop.png", {
    animations: "disabled",
  });

  await page.setViewportSize({ height: 620, width: 390 });
  await page.reload();
  await page.getByRole("button", { name: "Edit profile" }).click();
  await expect(page).toHaveScreenshot("dialog-demo-mobile.png", {
    animations: "disabled",
  });

  await page.setViewportSize({ height: 560, width: 900 });
  await page.goto(
    "/docs/static/examples/components/dialog-close-workflows.html",
  );
  await page.getByRole("button", { name: "Share" }).click();
  await expect(page).toHaveScreenshot("dialog-custom-close-desktop.png", {
    animations: "disabled",
  });
  await page.locator("#share-dialog [data-dialog-close]").click();
  await page.getByRole("button", { name: "Open dialog" }).click();
  await expect(page).toHaveScreenshot("dialog-no-close-desktop.png", {
    animations: "disabled",
  });

  await page.setViewportSize({ height: 520, width: 900 });
  await page.goto(
    "/docs/static/examples/components/dialog-scroll-workflows.html",
  );
  await page.getByRole("button", { name: "Review notes" }).click();
  await page.locator("#sticky-dialog [ng-dialog-body]").evaluate((element) => {
    element.scrollTop = element.scrollHeight / 2;
  });
  await expect(page).toHaveScreenshot("dialog-sticky-footer-desktop.png", {
    animations: "disabled",
  });

  await page.setViewportSize({ height: 560, width: 900 });
  await page.goto("/docs/static/examples/components/dialog-rtl.html");
  await page.getByRole("button", { name: "تعديل الملف الشخصي" }).click();
  await expect(page).toHaveScreenshot("dialog-rtl-desktop.png", {
    animations: "disabled",
  });
});

test("drawer examples preserve goal, side, scroll, responsive, and RTL visuals", async ({
  page,
}) => {
  await page.setViewportSize({ height: 620, width: 900 });
  await page.goto("/docs/static/examples/components/drawer.html");
  await page.getByRole("button", { name: "Open Drawer" }).click();
  await expect(page).toHaveScreenshot("drawer-demo-desktop.png", {
    animations: "disabled",
  });

  await page.goto("/docs/static/examples/components/drawer-sides.html");
  await page.getByRole("button", { name: "Right" }).click();
  await expect(page).toHaveScreenshot("drawer-sides-right-desktop.png", {
    animations: "disabled",
  });

  await page.setViewportSize({ height: 560, width: 900 });
  await page.goto("/docs/static/examples/components/drawer-scrollable.html");
  await page.getByRole("button", { name: "Scrollable Content" }).click();
  await page.locator("[ng-drawer-body]").evaluate((element) => {
    element.scrollTop = element.scrollHeight / 2;
  });
  await expect(page).toHaveScreenshot("drawer-scrollable-desktop.png", {
    animations: "disabled",
  });

  await page.setViewportSize({ height: 620, width: 900 });
  await page.goto("/docs/static/examples/components/drawer-dialog.html");
  await page
    .locator(".drawer-dialog-desktop")
    .getByRole("button", { name: "Edit Profile" })
    .click();
  await expect(page).toHaveScreenshot("drawer-dialog-desktop.png", {
    animations: "disabled",
  });

  await page.setViewportSize({ height: 700, width: 390 });
  await page.reload();
  await page
    .locator(".drawer-dialog-mobile")
    .getByRole("button", { name: "Edit Profile" })
    .click();
  await expect(page).toHaveScreenshot("drawer-dialog-mobile.png", {
    animations: "disabled",
  });

  await page.setViewportSize({ height: 620, width: 900 });
  await page.goto("/docs/static/examples/components/drawer-rtl.html");
  await page.getByRole("button", { name: "فتح الدرج" }).click();
  await expect(page).toHaveScreenshot("drawer-rtl-desktop.png", {
    animations: "disabled",
  });
});

test("sheet examples preserve profile, close, side, mobile, and RTL visuals", async ({
  page,
}) => {
  await page.setViewportSize({ height: 620, width: 900 });
  await page.goto("/docs/static/examples/components/sheet.html");
  await page.getByRole("button", { name: "Open", exact: true }).click();
  await expect(page).toHaveScreenshot("sheet-demo-desktop.png", {
    animations: "disabled",
  });

  await page.setViewportSize({ height: 700, width: 390 });
  await page.reload();
  await page.getByRole("button", { name: "Open", exact: true }).click();
  await expect(page).toHaveScreenshot("sheet-demo-mobile.png", {
    animations: "disabled",
  });

  await page.setViewportSize({ height: 620, width: 900 });
  await page.goto("/docs/static/examples/components/sheet-no-close.html");
  await page.getByRole("button", { name: "Open Sheet" }).click();
  await expect(page).toHaveScreenshot("sheet-no-close-desktop.png", {
    animations: "disabled",
  });

  await page.goto("/docs/static/examples/components/sheet-sides.html");
  await page.getByRole("button", { name: "Right" }).click();
  await page
    .locator("[ng-sheet]")
    .nth(1)
    .locator("[ng-sheet-body]")
    .evaluate((element) => {
      element.scrollTop = element.scrollHeight / 2;
    });
  await expect(page).toHaveScreenshot("sheet-side-right-desktop.png", {
    animations: "disabled",
  });

  await page.goto("/docs/static/examples/components/sheet-rtl.html");
  await page.getByRole("button", { name: "فتح" }).click();
  await expect(page).toHaveScreenshot("sheet-rtl-desktop.png", {
    animations: "disabled",
  });
});

test("sidebar examples preserve controlled, anatomy, collapse, and RTL visuals", async ({
  page,
}) => {
  await page.setViewportSize({ height: 700, width: 900 });
  await page.goto("/docs/static/examples/components/sidebar.html");
  await expect(page).toHaveScreenshot("sidebar-demo-desktop.png", {
    animations: "disabled",
  });
  await page.getByRole("button", { name: "Close Sidebar" }).click();
  await expect(page).toHaveScreenshot("sidebar-icon-desktop.png", {
    animations: "disabled",
  });

  await page.setViewportSize({ height: 800, width: 900 });
  await page.goto("/docs/static/examples/components/sidebar-anatomy.html");
  await expect(page).toHaveScreenshot("sidebar-anatomy-desktop.png", {
    animations: "disabled",
  });

  await page.setViewportSize({ height: 700, width: 900 });
  await page.goto("/docs/static/examples/components/sidebar-collapsible.html");
  await page.getByRole("button", { name: "Build Your Application" }).click();
  await expect(page).toHaveScreenshot("sidebar-collapsible-desktop.png", {
    animations: "disabled",
  });

  await page.goto("/docs/static/examples/components/sidebar-rtl.html");
  await expect(page).toHaveScreenshot("sidebar-rtl-desktop.png", {
    animations: "disabled",
  });
});

test("alert workflows preserve action, color, destructive, and RTL compositions", async ({
  page,
}) => {
  await page.setViewportSize({ height: 760, width: 900 });
  await page.goto("/docs/static/examples/components/alert-workflows.html");

  const alerts = page.locator("[ng-alert]");
  await expect(alerts).toHaveCount(6);
  expect(
    await alerts.evaluateAll((items) =>
      items.map((item) => item.getAttribute("role")),
    ),
  ).toEqual(["alert", "status", "alert", "alert", "alert", "alert"]);

  const warning = page.locator(".alert-warning-demo");
  const warningColors = await warning.evaluate((element) => {
    const probe = document.createElement("span");
    probe.style.color = "var(--amber-12)";
    document.body.append(probe);
    const foreground = getComputedStyle(element).color;
    const token = getComputedStyle(probe).color;
    probe.remove();
    return { foreground, token };
  });
  expect(warningColors.foreground).toBe(warningColors.token);

  const destructive = page.locator(`[ng-alert][data-variant="destructive"]`);
  const destructiveColors = await destructive.evaluate((element) => {
    const probe = document.createElement("span");
    probe.style.color = "var(--error)";
    document.body.append(probe);
    const foreground = getComputedStyle(element).color;
    const token = getComputedStyle(probe).color;
    probe.remove();
    return { foreground, token };
  });
  expect(destructiveColors.foreground).toBe(destructiveColors.token);

  const rtlAlert = page.locator(".alert-rtl-demo [ng-alert]").first();
  const rtlBox = await rtlAlert.boundingBox();
  const rtlIconBox = await rtlAlert
    .locator(":is([data-slot=alert-icon], [ng-alert-icon])")
    .boundingBox();
  expect(rtlBox).not.toBeNull();
  expect(rtlIconBox).not.toBeNull();
  expect(rtlIconBox!.x).toBeGreaterThan(rtlBox!.x + rtlBox!.width / 2);

  await expect(page.locator(".alert-workflow-grid")).toHaveScreenshot(
    "alert-workflows-desktop.png",
    { animations: "disabled" },
  );

  await page.getByRole("button", { name: "Enable" }).click();
  await expect(page.getByRole("button", { name: "Enabled" })).toBeDisabled();
  await expect(page.locator(".alert-workflow-output")).toContainText(
    "Dark mode: enabled",
  );
});

test("alert dialog workflows preserve size, media, destructive, focus, and RTL behavior", async ({
  page,
}) => {
  await page.setViewportSize({ height: 700, width: 900 });
  await page.goto(
    "/docs/static/examples/components/alert-dialog-workflows.html",
  );

  const content = (id: string) =>
    page.locator(
      `#${id} :is([data-slot=alert-dialog-content], [ng-alert-dialog-content])`,
    );
  const media = (id: string) =>
    page.locator(
      `#${id} :is([data-slot=alert-dialog-media], [ng-alert-dialog-media])`,
    );

  await expect(
    page.locator(
      ":is([data-slot=alert-dialog-content], [ng-alert-dialog-content])",
    ),
  ).toHaveCount(6);
  await expect(
    page.locator(
      ":is([data-slot=alert-dialog-content], [ng-alert-dialog-content]):visible",
    ),
  ).toHaveCount(0);

  const shareTrigger = page.getByRole("button", { name: "Share Project" });
  await shareTrigger.click();
  const shareContent = content("share-project-dialog");
  await expect(shareContent).toBeVisible();
  const shareBox = await shareContent.boundingBox();
  const shareMediaBox = await media("share-project-dialog").boundingBox();
  expect(shareBox).not.toBeNull();
  expect(shareMediaBox).toMatchObject({ height: 64, width: 64 });
  expect(shareBox!.width).toBeCloseTo(512, 0);
  await expect(shareContent).toHaveScreenshot(
    "alert-dialog-default-media-desktop.png",
    { animations: "disabled" },
  );
  await shareContent.getByRole("button", { name: "Cancel" }).click();
  await expect(shareContent).toBeHidden();
  await expect(shareTrigger).toBeFocused();

  await page
    .getByRole("button", { name: "Show Small Dialog", exact: true })
    .click();
  const smallContent = content("accessory-dialog");
  const smallBox = await smallContent.boundingBox();
  expect(smallBox).not.toBeNull();
  expect(smallBox!.width).toBeCloseTo(320, 0);
  const smallButtons = smallContent.locator(
    ":is([data-slot=alert-dialog-footer], [ng-alert-dialog-footer]) > button",
  );
  const smallButtonWidths = await smallButtons.evaluateAll((buttons) =>
    buttons.map((button) => button.getBoundingClientRect().width),
  );
  expect(smallButtonWidths[0]).toBeCloseTo(smallButtonWidths[1], 0);
  await expect(smallContent).toHaveScreenshot(
    "alert-dialog-small-desktop.png",
    { animations: "disabled" },
  );
  await smallContent.getByRole("button", { name: "Don't allow" }).click();

  await page
    .getByRole("button", { name: "Show Small Dialog With Media" })
    .click();
  const smallMediaContent = content("accessory-media-dialog");
  await expect(media("accessory-media-dialog")).toHaveCSS("width", "64px");
  await expect(smallMediaContent).toHaveScreenshot(
    "alert-dialog-small-media-desktop.png",
    { animations: "disabled" },
  );
  await smallMediaContent.getByRole("button", { name: "Don't allow" }).click();

  await page.getByRole("button", { name: "Delete Chat" }).click();
  const destructiveContent = content("delete-chat-dialog");
  const destructiveMedia = media("delete-chat-dialog");
  const destructiveColors = await destructiveMedia.evaluate((element) => {
    const probe = document.createElement("span");
    probe.style.color = "var(--error)";
    document.body.append(probe);
    const foreground = getComputedStyle(element).color;
    const token = getComputedStyle(probe).color;
    probe.remove();
    return { foreground, token };
  });
  expect(destructiveColors.foreground).toBe(destructiveColors.token);
  await expect(destructiveContent).toHaveScreenshot(
    "alert-dialog-destructive-desktop.png",
    { animations: "disabled" },
  );
  await destructiveContent.getByRole("button", { name: "Delete" }).click();
  await expect(destructiveContent).toBeHidden();
  await expect(page.getByRole("status")).toContainText("Chat: deleted");

  const rtlTrigger = page.getByRole("button", {
    name: "إظهار الحوار",
    exact: true,
  });
  await rtlTrigger.click();
  const rtlContent = content("rtl-confirmation-dialog");
  await expect(rtlContent).toHaveAttribute("data-direction", "rtl");
  const rtlContentBox = await rtlContent.boundingBox();
  const rtlTitleBox = await rtlContent
    .locator(":is([data-slot=alert-dialog-title], [ng-alert-dialog-title])")
    .boundingBox();
  expect(rtlContentBox).not.toBeNull();
  expect(rtlTitleBox).not.toBeNull();
  expect(rtlTitleBox!.x).toBeGreaterThan(
    rtlContentBox!.x + rtlContentBox!.width / 2,
  );
  await expect(rtlContent).toHaveScreenshot("alert-dialog-rtl-desktop.png", {
    animations: "disabled",
  });
  await rtlContent.getByRole("button", { name: "إلغاء" }).click();
  await expect(rtlTrigger).toBeFocused();

  await page.setViewportSize({ height: 480, width: 390 });
  await page
    .getByRole("button", { name: "Show Small Dialog With Media" })
    .click();
  const compactContentBox = await smallMediaContent.boundingBox();
  expect(compactContentBox).not.toBeNull();
  expect(compactContentBox!.x).toBeGreaterThanOrEqual(0);
  expect(compactContentBox!.y).toBeGreaterThanOrEqual(0);
  expect(compactContentBox!.x + compactContentBox!.width).toBeLessThanOrEqual(
    390,
  );
  expect(compactContentBox!.y + compactContentBox!.height).toBeLessThanOrEqual(
    480,
  );
  await smallMediaContent.getByRole("button", { name: "Don't allow" }).click();
});

test("aspect ratio workflows preserve portrait, square, and RTL geometry", async ({
  page,
}) => {
  await page.setViewportSize({ height: 620, width: 900 });
  await page.goto(
    "/docs/static/examples/components/aspect-ratio-workflows.html",
  );

  const portrait = page.getByLabel("Portrait aspect ratio");
  const square = page.getByLabel("Square aspect ratio");
  const landscape = page.getByLabel("Landscape aspect ratio");
  const [portraitBox, squareBox, landscapeBox] = await Promise.all([
    portrait.boundingBox(),
    square.boundingBox(),
    landscape.boundingBox(),
  ]);
  expect(portraitBox).not.toBeNull();
  expect(squareBox).not.toBeNull();
  expect(landscapeBox).not.toBeNull();
  expect(portraitBox!.width).toBeCloseTo(160, 0);
  expect(portraitBox!.width / portraitBox!.height).toBeCloseTo(9 / 16, 2);
  expect(squareBox).toMatchObject({ height: 192, width: 192 });
  expect(landscapeBox!.width / landscapeBox!.height).toBeCloseTo(16 / 9, 2);
  await expect(page.locator(".aspect-ratio-rtl")).toHaveAttribute("dir", "rtl");
  await expect(page.locator(".aspect-ratio-rtl figcaption")).toHaveText(
    "منظر طبيعي جميل",
  );
  expect(
    await page.locator(".aspect-ratio-image").evaluateAll((images) =>
      images.map((image) => ({
        objectFit: getComputedStyle(image).objectFit,
        position: getComputedStyle(image).position,
      })),
    ),
  ).toEqual(
    Array(3).fill({
      objectFit: "cover",
      position: "absolute",
    }),
  );
  await expect(page.locator(".aspect-ratio-workflows")).toHaveScreenshot(
    "aspect-ratio-workflows-desktop.png",
    { animations: "disabled" },
  );
});

test("avatar workflows preserve badges, group counts, sizes, dropdown composition, and RTL", async ({
  page,
}) => {
  await page.setViewportSize({ height: 620, width: 900 });
  await page.goto("/docs/static/examples/components/avatar-workflows.html");

  const sizeAvatars = page.getByLabel("Avatar sizes").locator("[ng-avatar]");
  await expect(sizeAvatars).toHaveCount(3);
  expect(
    await sizeAvatars.evaluateAll((avatars) =>
      avatars.map((avatar) => ({
        height: avatar.getBoundingClientRect().height,
        size: avatar.getAttribute("data-size"),
        width: avatar.getBoundingClientRect().width,
      })),
    ),
  ).toEqual([
    { height: 24, size: "sm", width: 24 },
    { height: 32, size: "default", width: 32 },
    { height: 40, size: "lg", width: 40 },
  ]);

  const badge = page
    .getByLabel("Avatar badge icon")
    .locator(":is([data-slot=avatar-badge], [ng-avatar-badge])");
  const badgeBox = await badge.boundingBox();
  const badgeIconBox = await badge.locator("svg").boundingBox();
  expect(badgeBox).toMatchObject({ height: 10, width: 10 });
  expect(badgeIconBox).toMatchObject({ height: 8, width: 8 });

  const groupCount = page
    .getByLabel("Avatar group count icon")
    .locator(":is([data-slot=avatar-group-count], [ng-avatar-group-count])");
  expect(await groupCount.boundingBox()).toMatchObject({
    height: 32,
    width: 32,
  });
  expect(await groupCount.locator("svg").boundingBox()).toMatchObject({
    height: 16,
    width: 16,
  });

  const rtlAvatar = page.locator(".avatar-rtl-badge");
  const rtlBadge = rtlAvatar.locator(
    ":is([data-slot=avatar-badge], [ng-avatar-badge])",
  );
  const [rtlAvatarBox, rtlBadgeBox] = await Promise.all([
    rtlAvatar.boundingBox(),
    rtlBadge.boundingBox(),
  ]);
  expect(rtlAvatarBox).not.toBeNull();
  expect(rtlBadgeBox).not.toBeNull();
  expect(rtlBadgeBox!.x).toBeLessThan(
    rtlAvatarBox!.x + rtlAvatarBox!.width / 2,
  );

  await expect(page.locator(".avatar-workflows")).toHaveScreenshot(
    "avatar-workflows-desktop.png",
    { animations: "disabled" },
  );

  const trigger = page.getByRole("button", { name: "Open user menu" });
  expect(await trigger.boundingBox()).toMatchObject({ height: 36, width: 36 });
  expect(await trigger.locator("[ng-avatar]").boundingBox()).toMatchObject({
    height: 32,
    width: 32,
  });
  await expect(trigger.locator(":scope > svg")).toHaveCount(0);

  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  const menu = page.locator(".avatar-dropdown-menu");
  await expect(menu).toHaveAttribute("data-open", "true");
  await expect(menu).toHaveCSS("width", "128px");
  await expect(page.locator(".avatar-dropdown-stage")).toHaveScreenshot(
    "avatar-dropdown-desktop.png",
    { animations: "disabled" },
  );

  await page.getByRole("menuitem", { name: "Profile" }).click();
  await expect(page.locator(".avatar-workflow-output")).toHaveText(
    "Selected: Profile",
  );
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeFocused();
});

test("breadcrumb workflows preserve separators, ellipsis, dropdown composition, and RTL", async ({
  page,
}) => {
  await page.setViewportSize({ height: 700, width: 900 });
  await page.goto("/docs/static/examples/components/breadcrumb-workflows.html");

  const breadcrumbs = page.locator("[ng-breadcrumb]");
  await expect(breadcrumbs).toHaveCount(5);
  const pages = page.locator(
    ":is([data-slot=breadcrumb-page], [ng-breadcrumb-page])",
  );
  await expect(pages).toHaveCount(5);
  for (const currentPage of await pages.all()) {
    await expect(currentPage).toHaveAttribute("aria-current", "page");
    await expect(currentPage).toHaveAttribute("aria-disabled", "true");
    await expect(currentPage).toHaveAttribute("role", "link");
  }

  const generatedSeparators = page.locator(
    '[data-breadcrumb-generated="separator"]',
  );
  await expect(generatedSeparators).toHaveCount(6);
  expect(
    await generatedSeparators.evaluateAll((icons) =>
      icons.map((icon) => {
        const box = icon.getBoundingClientRect();
        return { height: box.height, width: box.width };
      }),
    ),
  ).toEqual(Array(6).fill({ height: 14, width: 14 }));
  await expect(
    page.locator('[data-breadcrumb-generated="ellipsis"]'),
  ).toHaveCount(2);

  const collapsedTrigger = page.getByRole("button", {
    name: "Toggle breadcrumb menu",
  });
  await collapsedTrigger.click();
  await expect(collapsedTrigger).toHaveAttribute("aria-expanded", "true");
  await page.getByRole("menuitem", { name: "Themes" }).first().click();
  await expect(page.locator(".breadcrumb-workflow-output").first()).toHaveText(
    "Selected: Themes",
  );
  await expect(collapsedTrigger).toBeFocused();

  const dropdownSection = page.locator(".breadcrumb-dropdown-example");
  const dropdownTrigger = dropdownSection.getByRole("button", {
    name: "Components",
  });
  await dropdownTrigger.click();
  await expect(dropdownSection.getByRole("menu")).toHaveAttribute(
    "data-open",
    "true",
  );
  await page.keyboard.press("Escape");
  await expect(dropdownTrigger).toBeFocused();

  const rtlSection = page.locator(".breadcrumb-rtl-example");
  await expect(rtlSection).toHaveAttribute("dir", "rtl");
  const rtlTrigger = rtlSection.getByRole("button", { name: "المكونات" });
  const [rtlTriggerBox, rtlIconBox] = await Promise.all([
    rtlTrigger.boundingBox(),
    rtlTrigger.locator("svg").boundingBox(),
  ]);
  expect(rtlTriggerBox).not.toBeNull();
  expect(rtlIconBox).not.toBeNull();
  expect(rtlIconBox!.x).toBeLessThan(
    rtlTriggerBox!.x + rtlTriggerBox!.width / 2,
  );
  await rtlTrigger.click();
  await rtlSection.getByRole("menuitem", { name: "السمات" }).click();
  await expect(rtlSection.locator(".breadcrumb-workflow-output")).toHaveText(
    "المحدد: السمات",
  );

  await expect(page.locator(".breadcrumb-workflows")).toHaveScreenshot(
    "breadcrumb-workflows-desktop.png",
    { animations: "disabled" },
  );
});

test("button group workflows preserve command, form, overlay, nested, and RTL composition", async ({
  page,
}) => {
  await page.setViewportSize({ height: 1200, width: 900 });
  await page.goto(
    "/docs/static/examples/components/button-group-workflows.html",
  );

  const toolbar = page.getByRole("group", { name: "Message actions" });
  const nestedGroups = toolbar.locator(":scope > [ng-button-group]");
  await expect(nestedGroups).toHaveCount(3);
  await expect(toolbar).toHaveCSS("gap", "8px");
  const archive = toolbar.getByRole("button", { name: "Archive", exact: true });
  await archive.click();
  await expect(page.locator(".button-group-output").first()).toHaveText(
    "Action: Archive",
  );
  await expect(archive).not.toHaveAttribute("aria-pressed");

  const more = toolbar.getByRole("button", { name: "More Options" });
  await more.click();
  const toolbarMenu = toolbar.getByRole("menu");
  await expect(toolbarMenu).toHaveAttribute("data-open", "true");
  await toolbarMenu.getByRole("menuitem", { name: "Trash" }).click();
  await expect(page.locator(".button-group-output").first()).toHaveText(
    "Action: Trash",
  );

  const follow = page.getByRole("group", { name: "Follow actions" });
  const followMore = follow.getByRole("button", {
    name: "More follow actions",
  });
  await followMore.click();
  await expect(
    page.locator(".button-group-follow-menu").getByRole("menuitem"),
  ).toHaveCount(7);
  await expect(page.locator(".button-group-follow-menu")).toHaveScreenshot(
    "button-group-dropdown-open-desktop.png",
    {
      animations: "disabled",
    },
  );
  await page.keyboard.press("Escape");
  await expect(followMore).toBeFocused();

  const search = page.getByRole("textbox", { name: "Search query" });
  await search.fill("Invoices");
  await expect(search).toHaveValue("Invoices");
  await expect(page.getByText("Query: Invoices")).toBeVisible();

  const voice = page.getByRole("button", { name: "Voice Mode" });
  const voiceInput = page.getByRole("textbox", { name: "Voice message" });
  await expect(voice).toHaveAttribute("aria-pressed", "false");
  await voice.click();
  await expect(voice).toHaveAttribute("aria-pressed", "true");
  await expect(voiceInput).toBeDisabled();
  await expect(voiceInput).toHaveAttribute(
    "placeholder",
    "Record and send audio...",
  );

  const popoverTrigger = page.getByRole("button", { name: "Open Popover" });
  await popoverTrigger.click();
  const copilotDialog = page.getByRole("dialog", { name: "Copilot task" });
  await expect(copilotDialog).toBeVisible();
  await expect(page.locator(".button-group-popover-stage")).toHaveScreenshot(
    "button-group-popover-open-desktop.png",
    { animations: "disabled" },
  );
  await page.keyboard.press("Escape");
  await expect(popoverTrigger).toBeFocused();

  const currency = page.getByRole("combobox", { name: "Currency" });
  await currency.click();
  await page.getByRole("option", { name: "€ Euro" }).click();
  await expect(currency).toContainText("€");

  const rtlGroup = page.getByRole("group", { name: "إجراءات الرسالة" });
  const rtlMore = rtlGroup.getByRole("button", { name: "المزيد من الخيارات" });
  await rtlMore.click();
  const rtlMenu = rtlGroup.getByRole("menu");
  await expect(rtlMenu).toHaveAttribute("data-direction", "rtl");
  await rtlMenu.getByRole("menuitem", { name: "سلة المهملات" }).click();
  await expect(page.getByText("الإجراء: سلة المهملات")).toBeVisible();

  await expect(page.locator(".button-group-workflows")).toHaveScreenshot(
    "button-group-workflows-desktop.png",
    { animations: "disabled" },
  );
});

test("calendar workflows preserve reference scale, connected state, and disabled dates", async ({
  page,
}) => {
  await page.setViewportSize({ height: 1820, width: 900 });
  await page.goto("/docs/static/examples/components/calendar-workflows.html");

  const calendars = page.locator("[ng-calendar]");
  await expect(calendars).toHaveCount(6);
  expect((await calendars.nth(0).boundingBox())!.width).toBeCloseTo(214, 0);
  await expect(calendars.nth(1).locator(`[data-booked="true"]`)).toHaveCount(
    15,
  );
  await expect(calendars.nth(3).locator(`[aria-selected="true"]`)).toHaveCount(
    2,
  );
  const range = calendars.nth(4);
  await expect(range.locator(`[data-range-start="true"]`)).toHaveCount(1);
  await expect(range.locator(`[data-range-middle="true"]`)).toHaveCount(4);
  await expect(range.locator(`[data-range-end="true"]`)).toHaveCount(1);
  await expect(
    calendars
      .nth(5)
      .locator(
        `:is([data-slot=calendar-week-number], [ng-calendar-week-number])`,
      ),
  ).toHaveCount(6);
  await expect(page.locator(".calendar-workflow-grid")).toHaveScreenshot(
    "calendar-workflows-desktop.png",
    { animations: "disabled" },
  );
});

test("calendar compositions preserve custom cells, application adapters, and native time state", async ({
  page,
}) => {
  await page.setViewportSize({ height: 1750, width: 1100 });
  await page.goto(
    "/docs/static/examples/components/calendar-compositions.html",
  );

  const calendars = page.locator("[ng-calendar]");
  await expect(calendars).toHaveCount(5);
  expect((await calendars.nth(0).boundingBox())!.width).toBeCloseTo(352, 0);
  await expect(
    calendars.nth(0).locator(`[data-value="2026-09-12"] span`),
  ).toHaveText("$120");
  await expect(calendars.nth(3)).toHaveAttribute("data-direction", "rtl");
  await expect(
    calendars
      .nth(4)
      .locator(`:is([data-slot=calendar-day], [ng-calendar-day])`),
  ).toHaveCount(42);
  await page.getByLabel("Start time").fill("10:30");
  await expect(page.locator(".calendar-workflow-output").nth(2)).toContainText(
    "10:30",
  );
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  });
  await expect(page.locator(".calendar-composition-grid")).toHaveScreenshot(
    "calendar-compositions-desktop.png",
    { animations: "disabled" },
  );
});

test("date picker compositions preserve closed, parsing, range, mobile, and RTL visuals", async ({
  page,
}) => {
  const path = "/docs/static/examples/components/date-picker-workflows.html";

  await page.setViewportSize({ height: 620, width: 1100 });
  await page.goto(path);
  await expect(page.locator(".date-picker-grid")).toHaveScreenshot(
    "date-picker-workflows-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 760, width: 1100 });
  await page.reload();
  await page.locator("#date-picker-range").click();
  await expect(page).toHaveScreenshot("date-picker-range-open-desktop.png", {
    animations: "disabled",
  });

  await page.keyboard.press("Escape");
  const natural = page.getByRole("textbox", { name: "Schedule Date" });
  await natural.fill("October 5, 2026");
  await natural.press("ArrowDown");
  await expect(page).toHaveScreenshot("date-picker-natural-open-desktop.png", {
    animations: "disabled",
  });

  await page.keyboard.press("Escape");
  await page.locator("#date-picker-rtl-popover [ng-popover-trigger]").click();
  await expect(page).toHaveScreenshot("date-picker-rtl-open-desktop.png", {
    animations: "disabled",
  });

  await page.setViewportSize({ height: 1400, width: 390 });
  await page.reload();
  await expect(page.locator(".date-picker-grid")).toHaveScreenshot(
    "date-picker-workflows-mobile.png",
    { animations: "disabled" },
  );
});

test("card workflows preserve local image media, logical RTL layout, and form commands", async ({
  page,
}) => {
  await page.setViewportSize({ height: 700, width: 900 });
  await page.goto("/docs/static/examples/components/card-workflows.html");

  const cards = page.locator("[ng-card]");
  await expect(cards).toHaveCount(3);
  const image = page.locator(".card-cover-image");
  await expect(image).toHaveAttribute("src", "../../images/avatars/01.png");
  const [imageBox, overlayBox] = await Promise.all([
    image.boundingBox(),
    page.locator(".card-image-overlay").boundingBox(),
  ]);
  expect(imageBox).not.toBeNull();
  expect(overlayBox).not.toBeNull();
  expect(imageBox!.width / imageBox!.height).toBeCloseTo(16 / 9, 2);
  expect(overlayBox).toMatchObject({
    height: imageBox!.height,
    width: imageBox!.width,
  });
  await page.getByRole("button", { name: "View Event" }).click();
  await expect(page.locator(".card-workflow-output").nth(0)).toHaveText(
    "Viewing Design systems meetup",
  );

  const rtlCard = cards.nth(1);
  await expect(rtlCard).toHaveAttribute("dir", "rtl");
  const titleBox = await rtlCard
    .locator(`:is([data-slot=card-title], [ng-card-title])`)
    .boundingBox();
  const actionBox = await rtlCard
    .locator(`:is([data-slot=card-action], [ng-card-action])`)
    .boundingBox();
  expect(titleBox).not.toBeNull();
  expect(actionBox).not.toBeNull();
  expect(actionBox!.x).toBeLessThan(titleBox!.x);
  await page.locator("#card-email-rtl").fill("jane@example.com");
  await page.locator("#card-password-rtl").fill("secret");
  await rtlCard
    .getByRole("button", { name: "تسجيل الدخول", exact: true })
    .click();
  await expect(page.locator(".card-workflow-output").nth(1)).toContainText(
    "jane@example.com",
  );
  const smallCard = cards.nth(2);
  await expect(smallCard).toHaveAttribute("data-size", "sm");
  await expect(smallCard).toHaveCSS("gap", "12px");
  await smallCard.getByRole("button", { name: "See what's new" }).click();
  await expect(page.locator(".card-workflow-output").nth(2)).toHaveText(
    "Showing report updates",
  );
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  });
  await expect(page.locator(".card-workflows")).toHaveScreenshot(
    "card-workflows-desktop.png",
    { animations: "disabled" },
  );
});

test("carousel workflows preserve API state, multi-item snaps, vertical geometry, and autoplay", async ({
  page,
}) => {
  await page.setViewportSize({ height: 1080, width: 1200 });
  await page.goto("/docs/static/examples/components/carousel-workflows.html");

  const carousels = page.locator("[ng-carousel]");
  await expect(carousels).toHaveCount(4);
  await expect(page.locator("body")).toHaveAttribute(
    "data-example",
    "carousel-api carousel-multiple carousel-orientation carousel-plugin",
  );
  await expect(carousels.nth(0)).toHaveAttribute("data-count", "5");
  await expect(carousels.nth(1)).toHaveAttribute("data-count", "3");
  await expect(carousels.nth(2)).toHaveAttribute(
    "data-orientation",
    "vertical",
  );
  await expect(carousels.nth(2)).toHaveAttribute("data-count", "4");

  await carousels.nth(0).locator("[ng-carousel-next]").click();
  await expect(page.locator(".carousel-status").first()).toHaveText(
    "Slide 2 of 5",
  );
  await carousels.nth(2).press("ArrowDown");
  await expect(carousels.nth(2)).toHaveAttribute("data-index", "1");

  await carousels.nth(0).locator("[ng-carousel-previous]").click();
  await expect(carousels.nth(0)).toHaveAttribute("data-index", "0");
  await carousels.nth(2).press("ArrowUp");
  await expect(carousels.nth(2)).toHaveAttribute("data-index", "0");

  await carousels.nth(3).hover();
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  });
  await expect(page.locator(".carousel-workflow-grid")).toHaveScreenshot(
    "carousel-workflows-desktop.png",
    { animations: "disabled" },
  );
});

test("carousel compositions preserve RTL controls, responsive basis, and authored spacing", async ({
  page,
}) => {
  await page.setViewportSize({ height: 760, width: 1200 });
  await page.goto(
    "/docs/static/examples/components/carousel-compositions.html",
  );

  const carousels = page.locator("[ng-carousel]");
  await expect(carousels).toHaveCount(3);
  await expect(page.locator("body")).toHaveAttribute(
    "data-example",
    "carousel-rtl carousel-size carousel-spacing",
  );
  await expect(carousels.first()).toHaveAttribute("data-direction", "rtl");
  await carousels.first().locator("[ng-carousel-next]").click();
  await expect(carousels.first()).toHaveAttribute("data-index", "1");
  await expect(
    carousels
      .first()
      .locator(`:is([data-slot=carousel-item], [ng-carousel-item])`)
      .nth(1),
  ).toContainText("٢");
  await carousels.first().locator("[ng-carousel-previous]").click();
  await expect(carousels.first()).toHaveAttribute("data-index", "0");

  const spacedCards = carousels
    .nth(2)
    .locator(`:is([data-slot=card], [ng-card])`);
  const first = await spacedCards.first().boundingBox();
  const second = await spacedCards.nth(1).boundingBox();
  expect(first).not.toBeNull();
  expect(second).not.toBeNull();
  expect(second!.x - (first!.x + first!.width)).toBeCloseTo(12, 0);
  await expect(page.locator(".carousel-composition-grid")).toHaveScreenshot(
    "carousel-compositions-desktop.png",
    { animations: "disabled" },
  );
});

test("chart workflows preserve grid, axis, legend, and AngularTS tooltip state", async ({
  page,
}) => {
  await page.setViewportSize({ height: 850, width: 1200 });
  await page.goto("/docs/static/examples/components/chart-workflows.html");

  const charts = page.locator("[ng-chart]");
  await expect(charts).toHaveCount(4);
  await expect(page.locator("body")).toHaveAttribute(
    "data-example",
    "chart-example-grid chart-example-axis chart-example-tooltip chart-example-legend",
  );
  await expect(
    page.locator(`:is([data-slot=chart-bar-group], [ng-chart-bar-group])`),
  ).toHaveCount(24);
  await expect(
    page.locator(`:is([data-slot=chart-grid], [ng-chart-grid])`),
  ).toHaveCount(4);
  await expect(
    page.locator(`:is([data-slot=chart-axis], [ng-chart-axis])`),
  ).toHaveCount(3);
  await expect(
    page.locator(`:is([data-slot=chart-legend], [ng-chart-legend])`),
  ).toHaveCount(1);

  const tooltipWorkflow = page.locator(
    "[aria-labelledby='chart-tooltip-heading']",
  );
  await tooltipWorkflow
    .locator(`:is([data-slot=chart-bar-group], [ng-chart-bar-group])`)
    .first()
    .hover();
  const tooltip = tooltipWorkflow.locator(
    `:is([data-slot=chart-tooltip], [ng-chart-tooltip])`,
  );
  await expect(tooltip).toHaveAttribute("role", "status");
  await expect(tooltip).toContainText("January");
  await expect(tooltip).toContainText("Desktop186");
  await page.mouse.move(1190, 840);
  await expect(tooltip).toHaveCount(0);

  await expect(page.locator(".chart-workflow-grid")).toHaveScreenshot(
    "chart-workflows-desktop.png",
    { animations: "disabled" },
  );
});

test("chart compositions preserve active series, RTL, and tooltip variants", async ({
  page,
}) => {
  await page.setViewportSize({ height: 1050, width: 1200 });
  await page.goto("/docs/static/examples/components/chart-compositions.html");

  await expect(page.locator("body")).toHaveAttribute(
    "data-example",
    "chart-demo chart-rtl chart-tooltip",
  );
  const controls = page.locator(".chart-series-controls > button");
  const bars = page.locator(
    `.chart-daily-bars :is([data-slot=chart-bar], [ng-chart-bar])`,
  );
  await expect(bars).toHaveCount(30);
  await controls.nth(1).click();
  await expect(controls.nth(1)).toHaveAttribute("data-active", "true");
  await expect(bars.first()).toHaveAttribute("data-value", "36%");
  await bars.first().hover();
  await expect(
    page.locator(
      `.chart-interactive-demo :is([data-slot=chart-tooltip], [ng-chart-tooltip])`,
    ),
  ).toContainText("Mobile150");

  const rtl = page.locator(`.chart-composition[dir="rtl"] [ng-chart]`);
  await expect(rtl).toHaveAttribute("data-direction", "rtl");
  await expect(
    rtl.locator(`:is([data-slot=chart-bar-group], [ng-chart-bar-group])`),
  ).toHaveCount(6);
  const gallery = page.locator(".chart-tooltip-gallery");
  await expect(gallery).toHaveAttribute("role", "img");
  await expect(
    gallery.locator(`:is([data-slot=chart-tooltip], [ng-chart-tooltip])`),
  ).toHaveCount(4);
  await expect(gallery.locator(`[data-indicator="dashed"]`)).toHaveCount(2);
  await expect(gallery.locator(`[data-indicator="line"]`)).toHaveCount(1);

  await controls.nth(0).click();
  await page.mouse.move(1190, 1040);
  await expect(page.locator(".chart-composition-grid")).toHaveScreenshot(
    "chart-compositions-desktop.png",
    { animations: "disabled" },
  );
});

test("checkbox workflows preserve reference states, grouping, and RTL layout", async ({
  page,
}) => {
  await page.setViewportSize({ height: 720, width: 1000 });
  await page.goto("/docs/static/examples/components/checkbox-workflows.html");

  await expect(page.locator("body")).toHaveAttribute(
    "data-example",
    "checkbox-basic checkbox-description checkbox-disabled checkbox-group checkbox-invalid checkbox-rtl",
  );
  const checkboxes = page.locator("[ng-checkbox]");
  await expect(checkboxes).toHaveCount(12);
  await page.locator("#terms-checkbox-basic").check();
  await expect(page.getByRole("status")).toContainText("Basic true");
  await page.locator("#cds-dvds").check();
  await expect(page.getByRole("status")).toContainText("CDs true");
  await expect(page.locator("#toggle-checkbox-disabled")).toBeDisabled();
  await expect(page.locator("#terms-checkbox-invalid")).toHaveAttribute(
    "data-invalid",
    "true",
  );

  const rtl = page.locator(".checkbox-workflow-rtl");
  await expect(rtl).toHaveAttribute("dir", "rtl");
  const rtlField = rtl.locator(`:is([data-slot=field], [ng-field])`).first();
  const [controlBox, labelBox] = await Promise.all([
    rtlField.locator("[ng-checkbox]").boundingBox(),
    rtlField.locator("label").boundingBox(),
  ]);
  expect(controlBox).not.toBeNull();
  expect(labelBox).not.toBeNull();
  expect(controlBox!.x).toBeGreaterThan(labelBox!.x);

  await expect(page.locator(".checkbox-workflow-grid")).toHaveScreenshot(
    "checkbox-workflows-desktop.png",
    { animations: "disabled" },
  );
});

test("checkbox table keeps selection and selected-row state synchronized", async ({
  page,
}) => {
  await page.setViewportSize({ height: 420, width: 1000 });
  await page.goto(
    "/docs/static/examples/components/checkbox-compositions.html",
  );

  await expect(page.locator("body")).toHaveAttribute(
    "data-example",
    "checkbox-table",
  );
  const table = page.getByRole("table", { name: "Team members" });
  const rows = table.locator("tbody tr");
  const selectAll = page.getByRole("checkbox", { name: "Select all rows" });
  await expect(table).toHaveAttribute("data-row-count", "4");
  await expect(rows).toHaveCount(4);
  await expect(rows.nth(0)).toHaveAttribute("data-state", "selected");

  await selectAll.check();
  await expect(rows.locator("[ng-checkbox]:checked")).toHaveCount(4);
  await page.getByLabel("Select Marcus Rodriguez").uncheck();
  await expect(selectAll).not.toBeChecked();
  await expect(rows.nth(1)).toHaveAttribute("data-state", "");

  await selectAll.check();
  await selectAll.uncheck();
  await page.getByLabel("Select Sarah Chen").check();
  await expect(page.locator(".checkbox-table-demo")).toHaveScreenshot(
    "checkbox-table-desktop.png",
    { animations: "disabled" },
  );
});

test("collapsible workflows preserve native disclosure, settings, and RTL behavior", async ({
  page,
}) => {
  await page.setViewportSize({ height: 760, width: 1000 });
  await page.goto(
    "/docs/static/examples/components/collapsible-workflows.html",
  );

  await expect(page.locator("body")).toHaveAttribute(
    "data-example",
    "collapsible-basic collapsible-rtl collapsible-settings",
  );
  const product = page.locator(".collapsible-product");
  await product.locator("summary").click();
  await expect(product).toHaveAttribute("open", "");
  await expect(
    product.locator(
      `:is([data-slot=collapsible-content], [ng-collapsible-content])`,
    ),
  ).toBeVisible();

  const settings = page.locator(".collapsible-settings");
  await expect(settings.locator("input:visible")).toHaveCount(2);
  await page
    .getByRole("button", { name: "Toggle additional radius settings" })
    .click();
  await expect(settings.locator("input:visible")).toHaveCount(4);

  const rtl = page.locator(".collapsible-workflow-wide");
  await rtl.getByRole("button", { name: "تبديل التفاصيل" }).click();
  await expect(
    rtl.locator(
      `:is([data-slot=collapsible-content], [ng-collapsible-content])`,
    ),
  ).toBeVisible();
  await expect(page.locator(".collapsible-workflow-grid")).toHaveScreenshot(
    "collapsible-workflows-desktop.png",
    { animations: "disabled" },
  );
});

test("collapsible file tree expands nested reference folders", async ({
  page,
}) => {
  await page.setViewportSize({ height: 760, width: 800 });
  await page.goto(
    "/docs/static/examples/components/collapsible-compositions.html",
  );

  const tree = page.locator(".collapsible-file-tree");
  const components = tree.locator("details").first();
  await components.locator(":scope > summary").click();
  await components
    .locator("details")
    .first()
    .locator(":scope > summary")
    .click();
  await expect(tree.getByText("button.tsx", { exact: true })).toBeVisible();
  await expect(tree.getByText("app.tsx", { exact: true })).toBeVisible();
  await expect(page.locator(".collapsible-file-card")).toHaveScreenshot(
    "collapsible-file-tree-desktop.png",
    { animations: "disabled" },
  );
});

test("switch workflows preserve sizes, validation, choice cards, button state, and RTL", async ({
  page,
}) => {
  await page.setViewportSize({ height: 760, width: 900 });
  await page.goto("/docs/static/examples/components/switch-workflows.html");

  const small = page.locator("#switch-size-sm");
  const standard = page.locator("#switch-size-default");
  const disabled = page.locator("#switch-disabled-unchecked");
  const invalid = page.locator("#switch-terms");
  const selectedChoice = page.locator(
    '.switch-choice:has([ng-switch-control][data-state="checked"])',
  );
  const rtl = page.locator('[aria-label="RTL switch"]');
  const button = page.locator("#switch-button-control");

  const [smallBox, standardBox] = await Promise.all([
    small.boundingBox(),
    standard.boundingBox(),
  ]);
  expect(smallBox).not.toBeNull();
  expect(standardBox).not.toBeNull();
  expect(smallBox!.width).toBeLessThan(standardBox!.width);
  await expect(disabled).toBeDisabled();
  await expect(disabled).toHaveAttribute("data-disabled", "true");
  await expect(invalid).toHaveAttribute("data-invalid", "true");
  await expect(selectedChoice).toHaveCount(1);
  await expect(rtl).toHaveAttribute("dir", "rtl");

  await button.click();
  await expect(button).toHaveAttribute("aria-checked", "true");
  await page.mouse.move(880, 740);
  await expect(page.locator(".switch-workflows")).toHaveScreenshot(
    "switch-workflows-desktop.png",
    { animations: "disabled" },
  );
});

test("radio group workflows preserve model state, choice cards, fieldsets, validation, and RTL", async ({
  page,
}) => {
  await page.setViewportSize({ height: 760, width: 900 });
  await page.goto(
    "/docs/static/examples/components/radio-group-workflows.html",
  );

  const groups = page.locator("[ng-radio-group]");
  const checked = page.locator('[ng-radio-group-item][data-state="checked"]');
  const disabled = page.locator("#disabled-1");
  const invalid = page.locator('[name="notification"][aria-invalid="true"]');
  const rtl = page.locator('[aria-label="RTL density options"]');

  await expect(groups).toHaveCount(6);
  await expect(checked).toHaveCount(6);
  await expect(page.locator("#plus-plan")).toBeChecked();
  await expect(page.locator("#desc-r2")).toBeChecked();
  await expect(page.locator("#disabled-2")).toBeChecked();
  await expect(page.locator("#plan-monthly")).toBeChecked();
  await expect(page.locator("#invalid-email")).toBeChecked();
  await expect(page.locator("#r2-rtl")).toBeChecked();
  await expect(disabled).toBeDisabled();
  await expect(invalid).toHaveCount(3);
  await expect(rtl).toHaveAttribute("dir", "rtl");

  await page.locator("#pro-plan").check();
  await expect(page.locator("#pro-plan")).toHaveAttribute(
    "data-state",
    "checked",
  );
  await expect(
    page.locator(
      '.radio-choice:has([ng-radio-group-item][data-state="checked"])',
    ),
  ).toHaveCount(1);
  await page.mouse.move(880, 740);
  await expect(page.locator(".radio-group-workflows")).toHaveScreenshot(
    "radio-group-workflows-desktop.png",
    { animations: "disabled" },
  );
});

test("radio fields preserve Nova fieldset, content, title-card, invalid, disabled, and mobile compositions", async ({
  page,
}) => {
  await page.setViewportSize({ height: 1180, width: 900 });
  await page.goto("/docs/static/examples/components/radio-fields.html");
  await expect(page.locator("#radio-free")).toBeChecked();
  await expect(page.locator(".radio-fields-demo")).toHaveScreenshot(
    "radio-fields-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 1360, width: 390 });
  await page.reload();
  await expect(page.locator(".radio-fields-demo")).toHaveScreenshot(
    "radio-fields-mobile.png",
    { animations: "disabled" },
  );
});

test("Sonner workflows preserve description, position, type, and promise behavior", async ({
  page,
}) => {
  await page.setViewportSize({ height: 1040, width: 900 });
  await page.goto("/docs/static/examples/components/sonner-workflows.html");

  await page.getByRole("button", { name: "Show Toast", exact: true }).click();
  const descriptionToast = page
    .getByLabel("Description notifications")
    .locator(":is([data-slot=toast], [ng-toast])");
  await expect(descriptionToast).toContainText("Monday, January 3rd");

  await page.getByRole("button", { name: "Top Right" }).click();
  await expect(page.getByLabel("Position notifications")).toHaveAttribute(
    "data-position",
    "top-right",
  );

  await page
    .getByLabel("Toast types")
    .getByRole("button", { name: "Warning" })
    .click();
  await expect(
    page
      .getByLabel("Type notifications")
      .locator(":is([data-slot=toast], [ng-toast])"),
  ).toHaveAttribute("data-type", "warning");

  await page.mouse.move(890, 1030);
  await expect(page.locator(".sonner-workflow-grid")).toHaveScreenshot(
    "sonner-workflows-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 1200, width: 390 });
  await page.reload();
  await page.getByRole("button", { name: "Show Toast", exact: true }).click();
  await page.getByRole("button", { name: "Bottom Center" }).click();
  await page
    .getByLabel("Toast types")
    .getByRole("button", { name: "Error" })
    .click();
  await page.mouse.move(380, 1190);
  await expect(page.locator(".sonner-workflow-grid")).toHaveScreenshot(
    "sonner-workflows-mobile.png",
    { animations: "disabled" },
  );
});

test("Slider workflows preserve controlled, range, multiple, RTL, and vertical states", async ({
  page,
}) => {
  await page.setViewportSize({ height: 680, width: 900 });
  await page.goto("/docs/static/examples/components/slider-workflows.html");

  await page.getByRole("slider", { name: "Minimum temperature" }).fill("0.4");
  await page.getByRole("slider", { name: "Maximum price" }).fill("75");
  await page.getByRole("slider", { name: "Second value" }).fill("40");
  await page.getByRole("slider", { name: "مستوى الصوت" }).fill("65");
  await page.getByRole("slider", { name: "Second vertical value" }).fill("35");

  await expect(page.getByLabel("Temperature range")).toHaveAttribute(
    "data-values",
    "0.4,0.7",
  );
  await expect(page.getByLabel("Multiple slider values")).toHaveAttribute(
    "data-values",
    "10,40,70",
  );
  await expect(
    page.getByRole("slider", { name: "Second vertical value" }),
  ).toHaveAttribute("data-orientation", "vertical");

  await page.mouse.move(890, 670);
  await expect(page.locator(".slider-workflow-grid")).toHaveScreenshot(
    "slider-workflows-desktop.png",
    { animations: "disabled" },
  );

  await page.setViewportSize({ height: 720, width: 390 });
  await page.reload();
  await page.getByRole("slider", { name: "Minimum price" }).fill("35");
  await page.mouse.move(380, 710);
  await expect(page.locator(".slider-workflow-grid")).toHaveScreenshot(
    "slider-workflows-mobile.png",
    { animations: "disabled" },
  );
});

test("workflow iframes fit compact viewports without scrolling or clipping", async ({
  context,
  page: initialPage,
}) => {
  let page = initialPage;

  for (const [index, [name, path, height]] of (
    [
      [
        "button-workflows",
        "/docs/static/examples/components/button-workflows.html",
        480,
      ],
      [
        "badge-workflows",
        "/docs/static/examples/components/badge-workflows.html",
        300,
      ],
      [
        "spinner-workflows",
        "/docs/static/examples/components/spinner-workflows.html",
        740,
      ],
      [
        "accordion-state-workflows",
        "/docs/static/examples/components/accordion-state-workflows.html",
        800,
      ],
      [
        "accordion-layout-workflows",
        "/docs/static/examples/components/accordion-layout-workflows.html",
        1024,
      ],
      [
        "alert-workflows",
        "/docs/static/examples/components/alert-workflows.html",
        792,
      ],
      [
        "alert-dialog-workflows",
        "/docs/static/examples/components/alert-dialog-workflows.html",
        480,
      ],
      [
        "dialog-close-workflows",
        "/docs/static/examples/components/dialog-close-workflows.html",
        480,
      ],
      [
        "dialog-scroll-workflows",
        "/docs/static/examples/components/dialog-scroll-workflows.html",
        480,
      ],
      ["dialog-rtl", "/docs/static/examples/components/dialog-rtl.html", 420],
      [
        "drawer-dialog",
        "/docs/static/examples/components/drawer-dialog.html",
        480,
      ],
      [
        "drawer-sides",
        "/docs/static/examples/components/drawer-sides.html",
        480,
      ],
      [
        "drawer-scrollable",
        "/docs/static/examples/components/drawer-scrollable.html",
        480,
      ],
      ["drawer-rtl", "/docs/static/examples/components/drawer-rtl.html", 460],
      [
        "sheet-no-close",
        "/docs/static/examples/components/sheet-no-close.html",
        420,
      ],
      ["sheet-sides", "/docs/static/examples/components/sheet-sides.html", 480],
      ["sheet-rtl", "/docs/static/examples/components/sheet-rtl.html", 420],
      [
        "sidebar-anatomy",
        "/docs/static/examples/components/sidebar-anatomy.html",
        800,
      ],
      [
        "sidebar-collapsible",
        "/docs/static/examples/components/sidebar-collapsible.html",
        700,
      ],
      ["sidebar-rtl", "/docs/static/examples/components/sidebar-rtl.html", 700],
      [
        "aspect-ratio-workflows",
        "/docs/static/examples/components/aspect-ratio-workflows.html",
        816,
      ],
      [
        "avatar-workflows",
        "/docs/static/examples/components/avatar-workflows.html",
        720,
      ],
      [
        "breadcrumb-workflows",
        "/docs/static/examples/components/breadcrumb-workflows.html",
        1024,
      ],
      [
        "button-group-workflows",
        "/docs/static/examples/components/button-group-workflows.html",
        1800,
      ],
      [
        "calendar-workflows",
        "/docs/static/examples/components/calendar-workflows.html",
        2800,
      ],
      [
        "calendar-compositions",
        "/docs/static/examples/components/calendar-compositions.html",
        2600,
      ],
      [
        "date-picker-workflows",
        "/docs/static/examples/components/date-picker-workflows.html",
        1400,
      ],
      [
        "date-picker-with-dropdowns",
        "/docs/static/examples/components/date-picker-with-dropdowns.html",
        700,
      ],
      [
        "card-workflows",
        "/docs/static/examples/components/card-workflows.html",
        1500,
      ],
      [
        "carousel-workflows",
        "/docs/static/examples/components/carousel-workflows.html",
        1800,
      ],
      [
        "carousel-compositions",
        "/docs/static/examples/components/carousel-compositions.html",
        1200,
      ],
      [
        "chart-workflows",
        "/docs/static/examples/components/chart-workflows.html",
        1600,
      ],
      [
        "chart-compositions",
        "/docs/static/examples/components/chart-compositions.html",
        1500,
      ],
      [
        "checkbox-workflows",
        "/docs/static/examples/components/checkbox-workflows.html",
        1200,
      ],
      [
        "checkbox-compositions",
        "/docs/static/examples/components/checkbox-compositions.html",
        420,
      ],
      [
        "collapsible-workflows",
        "/docs/static/examples/components/collapsible-workflows.html",
        1000,
      ],
      [
        "collapsible-compositions",
        "/docs/static/examples/components/collapsible-compositions.html",
        1000,
      ],
      [
        "switch-workflows",
        "/docs/static/examples/components/switch-workflows.html",
        980,
      ],
      [
        "radio-group-workflows",
        "/docs/static/examples/components/radio-group-workflows.html",
        1320,
      ],
      [
        "radio-fields",
        "/docs/static/examples/components/radio-fields.html",
        1360,
      ],
      [
        "input-group-workflows",
        "/docs/static/examples/components/input-group-workflows.html",
        3600,
      ],
      [
        "input-group-compositions",
        "/docs/static/examples/components/input-group-compositions.html",
        1900,
      ],
      [
        "input-group-textarea-workflows",
        "/docs/static/examples/components/input-group-textarea-workflows.html",
        2800,
      ],
      [
        "input-group-rtl",
        "/docs/static/examples/components/input-group-rtl.html",
        700,
      ],
      [
        "empty-workflows",
        "/docs/static/examples/components/empty-workflows.html",
        3000,
      ],
      [
        "table-workflows",
        "/docs/static/examples/components/table-workflows.html",
        2600,
      ],
      [
        "input-workflows",
        "/docs/static/examples/components/input-workflows.html",
        3000,
      ],
      [
        "field-workflows",
        "/docs/static/examples/components/field-workflows.html",
        4200,
      ],
      [
        "item-workflows",
        "/docs/static/examples/components/item-workflows.html",
        3900,
      ],
      [
        "pagination-workflows",
        "/docs/static/examples/components/pagination-workflows.html",
        720,
      ],
      [
        "progress-workflows",
        "/docs/static/examples/components/progress-workflows.html",
        520,
      ],
      [
        "resizable-workflows",
        "/docs/static/examples/components/resizable-workflows.html",
        760,
      ],
      [
        "resizable-state-workflows",
        "/docs/static/examples/components/resizable-state-workflows.html",
        760,
      ],
      [
        "select-workflows",
        "/docs/static/examples/components/select-workflows.html",
        1420,
      ],
      [
        "select-state-workflows",
        "/docs/static/examples/components/select-state-workflows.html",
        480,
      ],
      [
        "combobox-workflows",
        "/docs/static/examples/components/combobox-workflows.html",
        1500,
      ],
      [
        "combobox-compositions",
        "/docs/static/examples/components/combobox-compositions.html",
        1200,
      ],
      [
        "combobox-state-workflows",
        "/docs/static/examples/components/combobox-state-workflows.html",
        480,
      ],
      [
        "command-dialog-workflows",
        "/docs/static/examples/components/command-dialog-workflows.html",
        1000,
      ],
      [
        "command-scrollable",
        "/docs/static/examples/components/command-scrollable.html",
        720,
      ],
      [
        "context-menu-workflows",
        "/docs/static/examples/components/context-menu-workflows.html",
        800,
      ],
      [
        "context-menu-sides",
        "/docs/static/examples/components/context-menu-sides.html",
        650,
      ],
      [
        "tabs-workflows",
        "/docs/static/examples/components/tabs-workflows.html",
        1080,
      ],
      [
        "toggle-group-workflows",
        "/docs/static/examples/components/toggle-group-workflows.html",
        1260,
      ],
      [
        "toggle-workflows",
        "/docs/static/examples/components/toggle-workflows.html",
        300,
      ],
      [
        "scroll-area-workflows",
        "/docs/static/examples/components/scroll-area-workflows.html",
        1260,
      ],
      [
        "sonner-workflows",
        "/docs/static/examples/components/sonner-workflows.html",
        1200,
      ],
      [
        "slider-workflows",
        "/docs/static/examples/components/slider-workflows.html",
        720,
      ],
      [
        "dropdown-workflows",
        "/docs/static/examples/components/dropdown-workflows.html",
        1380,
      ],
      [
        "hover-card-workflows",
        "/docs/static/examples/components/hover-card-workflows.html",
        1040,
      ],
      [
        "hover-card-rtl",
        "/docs/static/examples/components/hover-card-rtl.html",
        1040,
      ],
      [
        "popover-workflows",
        "/docs/static/examples/components/popover-workflows.html",
        1200,
      ],
      [
        "popover-rtl",
        "/docs/static/examples/components/popover-rtl.html",
        1260,
      ],
      [
        "tooltip-workflows",
        "/docs/static/examples/components/tooltip-workflows.html",
        1000,
      ],
      ["tooltip-rtl", "/docs/static/examples/components/tooltip-rtl.html", 480],
      [
        "menubar-workflows",
        "/docs/static/examples/components/menubar-workflows.html",
        2400,
      ],
      ["menubar-rtl", "/docs/static/examples/components/menubar-rtl.html", 720],
      [
        "native-select-workflows",
        "/docs/static/examples/components/native-select-workflows.html",
        920,
      ],
      [
        "native-select-rtl",
        "/docs/static/examples/components/native-select-rtl.html",
        420,
      ],
      [
        "navigation-menu-workflows",
        "/docs/static/examples/components/navigation-menu-workflows.html",
        1100,
      ],
      [
        "navigation-menu-rtl",
        "/docs/static/examples/components/navigation-menu-rtl.html",
        720,
      ],
    ] as const
  ).entries()) {
    if (index > 0 && index % 20 === 0) {
      await page.close();
      page = await context.newPage();
    }
    await page.setViewportSize({ height, width: 390 });
    await page.goto(path);
    const metrics = await page.evaluate(() => ({
      height: document.documentElement.scrollHeight,
      width: document.documentElement.scrollWidth,
    }));
    expect(metrics.height, `${name} height`).toBeLessThanOrEqual(height);
    expect(metrics.width, `${name} width`).toBeLessThanOrEqual(390);
  }
});
