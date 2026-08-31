import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

const checkOnly = process.argv.includes("--check");
const componentDirectory = "src/components";
const componentExamples = "docs/static/examples/components";
const elementExamples = "docs/static/examples/elements";
const failures: string[] = [];

const componentNames = readdirSync(componentDirectory)
  .filter((entry) => statSync(join(componentDirectory, entry)).isDirectory())
  .filter((entry) => existsSync(join(componentDirectory, entry, `${entry}.ts`)))
  .sort();

for (const component of componentNames) {
  const sourcePath = join(componentExamples, `${component}.html`);
  const targetPath = join(elementExamples, `${component}.html`);

  if (!existsSync(sourcePath)) {
    failures.push(`${component}: missing canonical example ${sourcePath}`);
    continue;
  }
  if (!existsSync(targetPath)) {
    failures.push(`${component}: missing element example ${targetPath}`);
    continue;
  }

  const source = readFileSync(sourcePath, "utf8");
  const target = readFileSync(targetPath, "utf8");
  if (source === target) continue;

  if (checkOnly) {
    failures.push(`${component}: element example differs from ${sourcePath}`);
  } else {
    writeFileSync(targetPath, source);
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(
  checkOnly
    ? `Element example mirror check passed for ${componentNames.length} components.`
    : `Synchronized ${componentNames.length} element examples.`,
);
