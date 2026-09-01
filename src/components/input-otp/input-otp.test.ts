import { expect, test } from "@playwright/test";

const exampleUrl = "/docs/static/examples/components/input-otp.html";

const clearInputs = async (page: import("@playwright/test").Page) => {
  const inputs = page.locator(`.input-otp-slot input`);
  for (let index = 0; index < (await inputs.count()); index += 1) {
    await inputs.nth(index).fill("");
  }
  return inputs;
};

test("input otp matches the six-slot reference and advances focus", async ({
  page,
}) => {
  await page.goto(exampleUrl);
  const root = page.locator("[ng-input-otp]");
  const inputs = page.locator(`.input-otp-slot input`);

  await expect(page.locator("body")).toHaveAttribute(
    "data-example",
    "input-otp-demo",
  );
  await expect(inputs).toHaveCount(6);
  await expect(root).toHaveAttribute("data-value", "123456");
  await expect(root).toHaveAttribute("data-complete", "true");
  await expect(inputs.nth(0)).toHaveAttribute("autocomplete", "one-time-code");
  await expect(inputs.nth(0)).toHaveAttribute("inputmode", "numeric");

  await inputs.nth(0).fill("9");
  await expect(inputs.nth(1)).toBeFocused();
  await expect(root).toHaveAttribute("data-value", "923456");
  await expect(page.getByRole("status")).toContainText("Code: 923456");
});

test("input otp distributes pasted characters across the published slots", async ({
  page,
}) => {
  await page.goto(exampleUrl);
  const inputs = await clearInputs(page);
  const root = page.locator("[ng-input-otp]");

  await inputs.nth(0).evaluate((input) => {
    const event = new Event("paste", {
      bubbles: true,
      cancelable: true,
    }) as ClipboardEvent;
    Object.defineProperty(event, "clipboardData", {
      value: { getData: () => "654321" },
    });
    input.dispatchEvent(event);
  });

  await expect(root).toHaveAttribute("data-value", "654321");
  await expect(root).toHaveAttribute("data-complete", "true");
  await expect(inputs.nth(5)).toBeFocused();
});

test("input otp binds a slot inserted into the functional page", async ({
  page,
}) => {
  await page.goto(exampleUrl);
  const group = page.locator(`.input-otp-group`);
  await group.evaluate((element) => {
    element.insertAdjacentHTML(
      "beforeend",
      '<span class="input-otp-slot"><input /></span>',
    );
  });

  const inputs = page.locator(`.input-otp-slot input`);
  await expect(inputs).toHaveCount(7);
  await expect(inputs.nth(6)).toHaveAttribute("autocomplete", "one-time-code");
  await expect(inputs.nth(6)).toHaveAttribute("aria-label", "Digit 7");
});

test("input otp mirrors native required, disabled, invalid, and active state", async ({
  page,
}) => {
  await page.goto(exampleUrl);
  const root = page.locator("[ng-input-otp]");
  const inputs = await clearInputs(page);
  const firstSlot = page.locator(`.input-otp-slot`).first();

  await inputs.nth(0).evaluate((input) => input.setAttribute("required", ""));
  await expect(root).toHaveAttribute("data-invalid", "true");
  await inputs.nth(0).focus();
  await expect(firstSlot).toHaveAttribute("data-active", "true");
  await inputs.nth(0).fill("1");
  await expect(root).toHaveAttribute("data-invalid", "false");
  await inputs.nth(1).evaluate((input) => input.setAttribute("disabled", ""));
  await expect(root).toHaveAttribute("data-disabled", "true");
});
