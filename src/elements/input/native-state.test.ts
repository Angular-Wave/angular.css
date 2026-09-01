import { expect, test, type Page } from "@playwright/test";

const openElementArtifact = async (page: Page, component: string) => {
  await page.goto(`/docs/static/examples/elements/${component}.html`);
  await expect(
    page.locator('script[src$="/js/angular-ts.umd.js"]'),
  ).toHaveCount(1);
  await expect(
    page.locator('script[src$="/js/angular-css.umd.js"]'),
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

test("native text-control artifacts synchronize browser and AngularTS state", async ({
  page,
}) => {
  await openElementArtifact(page, "input");
  const search = page.getByLabel("Search");
  await search.fill("semantic");
  await expect(search).toHaveValue("semantic");
  await expect(page.locator(".output")).toHaveText("Value: semantic");
  await expect(page.getByLabel("Disabled")).toBeDisabled();
  await expect(page.getByLabel("Invalid")).toHaveAttribute(
    "aria-invalid",
    "true",
  );

  await openElementArtifact(page, "textarea");
  const message = page.getByLabel("Message");
  await message.fill("Packaged artifact");
  await expect(message).toHaveValue("Packaged artifact");
  await expect(page.locator(".output")).toContainText(
    "Message: Packaged artifact",
  );
  await expect(page.getByLabel("Disabled")).toBeDisabled();
  await expect(page.getByLabel("Invalid")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
});

test("native choice artifacts preserve checked state and keyboard interaction", async ({
  page,
}) => {
  await openElementArtifact(page, "checkbox");
  const terms = page
    .getByRole("checkbox", {
      name: "Accept terms and conditions",
      exact: true,
    })
    .first();
  await terms.check();
  await expect(terms).toBeChecked();
  await expect(page.getByRole("status")).toContainText("Terms accepted");

  await openElementArtifact(page, "switch");
  const switchControl = page.getByRole("switch", { name: "Airplane Mode" });
  await switchControl.check();
  await expect(switchControl).toBeChecked();
  await expect(page.locator(".output")).toContainText("true");

  await openElementArtifact(page, "radio-group");
  const comfortable = page.getByRole("radio", { name: "Comfortable" });
  const compact = page.getByRole("radio", { name: "Compact" });
  await expect(comfortable).toBeChecked();
  await comfortable.focus();
  await comfortable.press("ArrowDown");
  await expect(compact).toBeChecked();
  await expect(compact).toBeFocused();
  await expect(page.locator(".output")).toContainText("compact");
});

test("native range and select artifacts expose synchronized values", async ({
  page,
}) => {
  await openElementArtifact(page, "slider");
  const volume = page.getByRole("slider", { name: "Volume" });
  await volume.fill("63");
  await expect(volume).toHaveAttribute("aria-valuenow", "63");
  await expect(volume).toHaveAttribute("data-value", "63");
  await expect(volume).toHaveCSS("--value", "63%");
  await expect(page.locator('output[for="volume"]')).toHaveText("63");
  await expect(page.getByRole("slider", { name: "Muted" })).toBeDisabled();

  await openElementArtifact(page, "native-select");
  const select = page.getByRole("combobox", { name: "Status" });
  await select.selectOption("done");
  await expect(select).toHaveValue("done");
});

test("button-group, toggle, and progress artifacts keep commands and state connected", async ({
  page,
}) => {
  await openElementArtifact(page, "button-group");
  await expect(page.locator("[ng-button-group]").first()).toHaveAttribute(
    "role",
    "group",
  );
  await page.getByRole("button", { name: "Copy" }).click();
  await expect(page.getByRole("status")).toHaveText("Action: Copy");

  await openElementArtifact(page, "toggle");
  const bookmark = page.getByRole("button", { name: "Toggle bookmark" });
  await expect(bookmark).toHaveAttribute("aria-pressed", "false");
  await bookmark.click();
  await expect(bookmark).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".output")).toContainText("Bookmark: on");

  await openElementArtifact(page, "progress");
  const labeled = page.getByRole("progressbar", {
    name: "Upload progress",
  });
  await expect(labeled).toHaveAttribute("aria-valuenow", "56");
  await expect(labeled.locator('[data-slot="progress-value"]')).toHaveText(
    "56%",
  );
});
