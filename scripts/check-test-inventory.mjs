import { existsSync } from "node:fs";
import { join } from "node:path";

import { catalogNames, catalogPolicy } from "./component-policy.ts";

const failures = catalogNames
  .map((name) => {
    const { category } = catalogPolicy[name];
    const path = join("src", category, name, `${name}.test.ts`);
    return existsSync(path) ? null : `${name}: missing ${path}`;
  })
  .filter(Boolean);

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Test inventory check passed for ${catalogNames.length} entries.`);
