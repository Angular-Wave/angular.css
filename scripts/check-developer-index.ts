import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { catalogNames } from "./component-policy.ts";

const indexSource = readFileSync("index.html", "utf8");
const linkedEntries = [
  ...indexSource.matchAll(
    /href="\.\/docs\/static\/examples\/components\/([^"/]+)\.html"/g,
  ),
]
  .map(([, name]) => name)
  .sort();
const failures: string[] = [];

if (JSON.stringify(linkedEntries) !== JSON.stringify(catalogNames)) {
  const missing = catalogNames.filter((name) => !linkedEntries.includes(name));
  const unexpected = linkedEntries.filter((name) => !catalogNames.includes(name));
  if (missing.length > 0) failures.push(`index.html: missing ${missing.join(", ")}`);
  if (unexpected.length > 0) {
    failures.push(`index.html: unexpected or duplicate ${unexpected.join(", ")}`);
  }
}

for (const name of linkedEntries) {
  const example = join("docs/static/examples/components", `${name}.html`);
  if (!existsSync(example)) failures.push(`index.html: missing ${example}`);
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Developer index check passed for ${catalogNames.length} entries.`);
