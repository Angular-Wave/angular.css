import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

import AxeBuilder from "@axe-core/playwright";
import { test } from "@playwright/test";

const examplesDirectory = fileURLToPath(
  new URL("../docs/static/examples/components/", import.meta.url),
);
const examples = readdirSync(examplesDirectory)
  .filter((name) => name.endsWith(".html"))
  .sort();

const supportedViewports = [
  { height: 1200, label: "desktop", width: 900 },
  { height: 4000, label: "mobile", width: 390 },
] as const;

const formatViolations = (
  violations: Awaited<ReturnType<AxeBuilder["analyze"]>>["violations"],
) =>
  violations
    .map(
      (violation) =>
        `${violation.id} (${violation.impact}): ${violation.help}\n${violation.nodes
          .map(
            (node) =>
              `  ${node.target.join(" ")}\n  ${node.failureSummary ?? ""}`,
          )
          .join("\n")}`,
    )
    .join("\n\n");

for (const example of examples) {
  test(`${example} has no serious or critical accessibility violations`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const viewport of supportedViewports) {
      await page.setViewportSize(viewport);
      await page.goto("/docs/static/examples/components/" + example);

      const results = await new AxeBuilder({ page }).analyze();
      const blockingViolations = results.violations.filter(
        ({ impact }) => impact === "serious" || impact === "critical",
      );

      if (blockingViolations.length > 0) {
        throw new Error(
          `${example} at ${viewport.label} (${viewport.width}px)\n${formatViolations(blockingViolations)}`,
        );
      }
    }
  });
}
