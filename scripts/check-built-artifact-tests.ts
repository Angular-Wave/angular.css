import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

const baselinePath = "scripts/constructed-test-baseline.txt";
const write = process.argv.includes("--write");

const filesIn = (directory: string): string[] =>
  readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    return statSync(path).isDirectory()
      ? filesIn(path)
      : path.endsWith(".test.ts")
        ? [path]
        : [];
  });

const testFiles = ["src", "docs/tests"]
  .filter(existsSync)
  .flatMap(filesIn)
  .sort();
const violations = testFiles.filter((path) => {
  const source = readFileSync(path, "utf8");
  return (
    /page\.setContent\s*\(/.test(source) ||
    /import\(\s*["'`]\/src\/(?:components|elements)\//.test(source) ||
    /from\s+["'`]\/src\/(?:components|elements)\//.test(source) ||
    /\b[A-Za-z_$][\w$]*Directive\(\)\.link\s*\(/.test(source)
  );
});
const expected = violations.length > 0 ? `${violations.join("\n")}\n` : "";

if (write) {
  writeFileSync(baselinePath, expected);
  console.log(
    `Recorded ${violations.length} legacy source-constructed test files.`,
  );
  process.exit(0);
}

if (!existsSync(baselinePath)) {
  console.error(`Missing ${baselinePath}.`);
  process.exit(1);
}

const baseline = readFileSync(baselinePath, "utf8");
if (baseline !== expected) {
  const previous = new Set(baseline.trim().split("\n").filter(Boolean));
  const current = new Set(violations);
  const added = violations.filter((path) => !previous.has(path));
  const migrated = [...previous].filter((path) => !current.has(path));
  if (added.length > 0) {
    console.error(
      `New tests construct components instead of exercising built HTML:\n${added.join("\n")}`,
    );
  }
  if (migrated.length > 0) {
    console.error(
      `Built-artifact test migrations are complete for:\n${migrated.join("\n")}\nRefresh the shrinking baseline with npm run migrate:test-artifact-baseline.`,
    );
  }
  process.exit(1);
}

console.log(
  `Built-artifact test policy passed; ${violations.length} legacy files remain on the shrinking baseline.`,
);
