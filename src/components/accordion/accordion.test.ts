import { expect, test, type Page } from "@playwright/test";

const canonicalUrl = "/docs/static/examples/components/accordion.html";
const statesUrl =
  "/docs/static/examples/components/accordion-state-workflows.html";

const expectBuiltArtifactRuntime = async (page: Page): Promise<void> => {
  await expect(
    page.locator('script[src$="/js/angular-ts.umd.js"]'),
  ).toHaveCount(1);
  await expect(
    page.locator('script[src$="/js/angular-css.umd.js"]'),
  ).toHaveCount(1);

  const resources = await page.evaluate(() =>
    performance.getEntriesByType("resource").map((entry) => entry.name),
  );

  expect(resources.some((url) => url.endsWith("/angular-ts.umd.js"))).toBe(
    true,
  );
  expect(resources.some((url) => url.endsWith("/angular-css.umd.js"))).toBe(
    true,
  );
  expect(
    resources.filter((url) =>
      /\/src\/(?:components|elements)\/.*\.ts$/.test(url),
    ),
  ).toEqual([]);
};

test("canonical accordion preserves initial state and single-item behavior", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  await expectBuiltArtifactRuntime(page);
  const root = page.locator("[ng-accordion]");
  const items = page.locator(
    `:is([data-slot=accordion-item], [ng-accordion-item])`,
  );
  const triggers = page.locator(
    `:is([data-slot=accordion-trigger], [ng-accordion-trigger])`,
  );
  const panels = page.locator(
    `:is([data-slot=accordion-content], [ng-accordion-content])`,
  );

  await expect(root).not.toHaveAttribute("data-slot");
  await expect(triggers).toHaveCount(3);
  await expect(triggers.nth(0)).toHaveAttribute("aria-expanded", "true");
  await expect(panels.nth(0)).toHaveAttribute("data-open", "true");

  await triggers.nth(1).click();
  await expect(items.nth(0)).toHaveAttribute("data-state", "closed");
  await expect(items.nth(1)).toHaveAttribute("data-state", "open");
  await expect(triggers.nth(0)).toHaveAttribute("aria-expanded", "false");
  await expect(triggers.nth(1)).toHaveAttribute("aria-expanded", "true");

  await triggers.nth(1).click();
  await expect(items.nth(1)).toHaveAttribute("data-state", "closed");
  await expect(panels.nth(1)).toHaveAttribute("data-open", "false");
});

test("canonical accordion supplies semantic relationships and keyboard focus", async ({
  page,
}) => {
  await page.goto(canonicalUrl);
  const items = page.locator(
    `:is([data-slot=accordion-item], [ng-accordion-item])`,
  );
  const triggers = page.locator(
    `:is([data-slot=accordion-trigger], [ng-accordion-trigger])`,
  );
  const panels = page.locator(
    `:is([data-slot=accordion-content], [ng-accordion-content])`,
  );

  await expect(triggers.nth(0)).toHaveAttribute(
    "aria-controls",
    (await panels.nth(0).getAttribute("id")) ?? "",
  );
  await expect(panels.nth(0)).toHaveAttribute("role", "region");
  await expect(panels.nth(0)).toHaveAttribute(
    "aria-labelledby",
    (await triggers.nth(0).getAttribute("id")) ?? "",
  );

  await triggers.nth(0).focus();
  await triggers.nth(0).press("ArrowDown");
  await expect(triggers.nth(1)).toBeFocused();
  await triggers.nth(1).press("End");
  await expect(triggers.nth(2)).toBeFocused();
  await triggers.nth(2).press("Home");
  await expect(triggers.nth(0)).toBeFocused();

  await items.evaluateAll((allItems) => {
    allItems[0].setAttribute("data-state", "closed");
    allItems[2].setAttribute("data-state", "open");
  });
  await expect(triggers.nth(2)).toHaveAttribute("aria-expanded", "true");
  await expect(panels.nth(2)).toHaveAttribute("data-open", "true");
  await expect(items.nth(0)).toHaveAttribute("data-state", "closed");
});

test("accordion workflow page covers multiple and disabled behavior", async ({
  page,
}) => {
  await page.goto(statesUrl);
  await expectBuiltArtifactRuntime(page);
  const multiple = page.locator(
    '[ng-accordion][aria-label="Settings questions"]',
  );
  const multipleTriggers = multiple.locator(
    ":is([data-slot=accordion-trigger], [ng-accordion-trigger])",
  );
  const multiplePanels = multiple.locator(
    `:is([data-slot=accordion-content], [ng-accordion-content])`,
  );
  const disabledRoot = page.locator(
    '[ng-accordion][aria-label="Feature availability questions"]',
  );
  const disabledTriggers = disabledRoot.locator(
    ":is([data-slot=accordion-trigger], [ng-accordion-trigger])",
  );

  await expect(multiple).toHaveAttribute("multiple", "");
  await multipleTriggers.nth(1).click();
  await expect(multiplePanels.nth(0)).toHaveAttribute("data-open", "true");
  await expect(multiplePanels.nth(1)).toHaveAttribute("data-open", "true");

  await expect(disabledTriggers.nth(1)).toBeDisabled();
  await disabledTriggers.nth(0).focus();
  await disabledTriggers.nth(0).press("ArrowDown");
  await expect(disabledTriggers.nth(2)).toBeFocused();
});
