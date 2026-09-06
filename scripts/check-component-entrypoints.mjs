import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { catalogNames, catalogPolicy } from "./component-policy.ts";

const failures = [];

for (const name of catalogNames) {
  const { category, runtime } = catalogPolicy[name];
  const directory = join("src", category, name);

  for (const extension of ["css", "html", "test.ts"]) {
    const path = join(directory, `${name}.${extension}`);
    if (!existsSync(path)) failures.push(`${name}: missing ${path}`);
  }

  const testPath = join(directory, `${name}.test.ts`);
  const sourceUrl = `/${directory}/${name}.html`;
  if (existsSync(testPath)) {
    const testSource = readFileSync(testPath, "utf8");
    const usesSharedSourceTest =
      testSource.includes("testStyleOnlyElement") &&
      testSource.includes(`category: "${category}"`) &&
      testSource.includes(`name: "${name}"`);
    if (!testSource.includes(sourceUrl) && !usesSharedSourceTest) {
      failures.push(`${testPath}: must exercise canonical source page ${sourceUrl}`);
    }
  }

  const sourcePath = join(directory, `${name}.ts`);
  if (existsSync(sourcePath) !== runtime) {
    failures.push(
      runtime
        ? `${name}: missing runtime entrypoint ${sourcePath}`
        : `${name}: styling-only entry must not have ${sourcePath}`,
    );
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Catalog entrypoint check passed.");
