import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const componentNames = readdirSync("src/components")
  .filter((entry) => statSync(join("src/components", entry)).isDirectory())
  .filter((entry) => existsSync(join("src/components", entry, `${entry}.ts`)))
  .sort();

const failures = [];

for (const componentName of componentNames) {
  const testFile = join(
    "src/components",
    componentName,
    `${componentName}.test.ts`,
  );

  if (!existsSync(testFile)) {
    failures.push(`${componentName}: missing component test ${testFile}`);
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Test inventory check passed.");
