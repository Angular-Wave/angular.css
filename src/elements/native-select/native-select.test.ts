import { expect, test } from "@playwright/test";

test("native select element example exercises the built functional artifact", async ({
  page,
}) => {
  await page.goto("/docs/static/examples/elements/native-select.html");

  const select = page.getByRole("combobox", { name: "Status" });
  await expect(select).toHaveValue("");
  await select.selectOption("done");
  await expect(select).toHaveValue("done");

  const sourceRequests = await page.evaluate(() =>
    performance
      .getEntriesByType("resource")
      .map((entry) => entry.name)
      .filter((url) => /\/src\/(?:components|elements)\/.*\.ts$/.test(url)),
  );
  expect(sourceRequests).toEqual([]);
});
