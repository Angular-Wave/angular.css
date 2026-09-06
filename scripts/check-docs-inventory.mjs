import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { catalogNames, catalogPolicy } from "./component-policy.ts";

const failures = [];

for (const name of catalogNames) {
  const { category } = catalogPolicy[name];
  const docsPage = join("docs/content/docs", category, `${name}.md`);
  const examplePage = join("docs/static/examples/components", `${name}.html`);

  if (!existsSync(docsPage)) {
    failures.push(`${name}: missing documentation page ${docsPage}`);
  } else {
    const source = readFileSync(docsPage, "utf8");
    if (source.match(/^title:\s*(.+)$/m)?.[1]?.trim() !== name) {
      failures.push(`${docsPage}: title must be "${name}"`);
    }
    if (!source.includes(`src="examples/components/${name}.html"`)) {
      failures.push(`${docsPage}: must embed the canonical ${name} demo`);
    }
  }

  if (!existsSync(examplePage)) {
    failures.push(`${name}: missing canonical demo ${examplePage}`);
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Docs inventory check passed for ${catalogNames.length} entries.`);
