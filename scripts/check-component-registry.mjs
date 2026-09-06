import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import {
  catalogCategories,
  catalogNames,
  catalogPolicy,
} from "./component-policy.ts";

const indexSource = readFileSync("src/index.ts", "utf8");
const imports = new Map(
  [...indexSource.matchAll(/import \{ ([A-Za-z0-9_$]+) \} from "\.\/([^\"]+)";/g)].map(
    ([, symbol, path]) => [path, symbol],
  ),
);
const registrations = new Set(
  [...indexSource.matchAll(/\["[^"]+",\s*([A-Za-z0-9_$]+)\]/g)].map(
    ([, symbol]) => symbol,
  ),
);
const failures = [];

for (const category of catalogCategories) {
  const directory = join("src", category);
  const expected = catalogNames.filter(
    (name) => catalogPolicy[name].category === category,
  );
  const actual = existsSync(directory)
    ? readdirSync(directory)
        .filter((name) => statSync(join(directory, name)).isDirectory())
        .sort()
    : [];

  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    failures.push(
      `${directory}: expected ${expected.join(", ")}; found ${actual.join(", ")}`,
    );
  }
}

for (const name of catalogNames) {
  const policy = catalogPolicy[name];
  const sourcePath = join("src", policy.category, name, `${name}.ts`);

  if (!policy.runtime) {
    if (existsSync(sourcePath)) {
      failures.push(`${sourcePath}: styling entries must not ship TypeScript`);
    }
    continue;
  }

  if (!existsSync(sourcePath)) {
    failures.push(`${sourcePath}: runtime component is missing TypeScript`);
    continue;
  }

  const source = readFileSync(sourcePath, "utf8");
  const directive = source.match(/export function ([A-Za-z0-9_$]+Directive)\(/)?.[1];
  const importPath = `${policy.category}/${name}/${name}`;
  if (!directive) {
    failures.push(`${sourcePath}: runtime component must export a directive factory`);
  } else if (imports.get(importPath) !== directive) {
    failures.push(`src/index.ts: must import ${directive} from ./${importPath}`);
  } else if (!registrations.has(directive)) {
    failures.push(`src/index.ts: must register ${directive}`);
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Catalog registry check passed for ${catalogNames.length} entries.`);
