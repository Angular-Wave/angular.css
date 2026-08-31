import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const checkOnly = process.argv.includes("--check");
const sourceDirectory = "examples/bookings";
const targetDirectory = "docs/static/examples/applications/bookings";
const sourceFiles = ["bookings.css", "bookings.js", "index.html"];
const failures: string[] = [];

const targetContent = (file: string, source: string): string => {
  if (file !== "index.html") return source;
  return source
    .replaceAll("../../docs/static/css/", "../../../css/")
    .replaceAll("../../docs/static/js/", "../../../js/");
};

for (const file of sourceFiles) {
  const sourcePath = join(sourceDirectory, file);
  const targetPath = join(targetDirectory, file);
  if (!existsSync(sourcePath)) {
    failures.push(`Missing built application file: ${sourcePath}`);
    continue;
  }

  const expected = targetContent(file, readFileSync(sourcePath, "utf8"));
  if (checkOnly) {
    if (!existsSync(targetPath)) {
      failures.push(`Missing Hugo application file: ${targetPath}`);
    } else if (readFileSync(targetPath, "utf8") !== expected) {
      failures.push(`Stale Hugo application file: ${targetPath}`);
    }
    continue;
  }

  mkdirSync(targetDirectory, { recursive: true });
  writeFileSync(targetPath, expected);
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(
  checkOnly
    ? "Application example mirror check passed."
    : "Synchronized the bookings application example.",
);
