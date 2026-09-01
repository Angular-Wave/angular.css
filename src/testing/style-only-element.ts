import { expect, test } from "@playwright/test";

interface StyleOnlyElementContract {
  readonly directive: string;
  readonly name: string;
  readonly selector: string;
}

export function testStyleOnlyElement({
  directive,
  name,
  selector,
}: StyleOnlyElementContract): void {
  test(`${name} remains styling-only in the built artifact`, async ({
    page,
  }) => {
    await page.goto(`/docs/static/examples/components/${name}.html`);

    const element = page.locator(selector).first();
    await expect(element).toBeVisible();
    await expect(element).not.toHaveCSS("display", "none");

    const registeredDirectives = await page.evaluate(() => {
      const runtime = window.angular as unknown as {
        module: (moduleName: string) => {
          _invokeQueue?: Array<[string, string, [string]]>;
        };
      };

      return (
        runtime
          .module("ui")
          ._invokeQueue?.flatMap((entry) =>
            entry[1] === "directive" ? [entry[2][0]] : [],
          ) ?? []
      );
    });

    expect(registeredDirectives).not.toContain(directive);
  });
}
