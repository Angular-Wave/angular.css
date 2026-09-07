import { readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

import { format } from "prettier";

import { catalogCategories } from "./component-policy.ts";

const roots = [
  ...catalogCategories.map((category) => join("src", category)),
  "docs/static/examples",
  "examples",
];
const filesIn = (directory: string): string[] =>
  readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    return statSync(path).isDirectory() ? filesIn(path) : [path];
  });

const failures: string[] = [];

for (const path of roots
  .flatMap(filesIn)
  .filter((file) => extname(file) === ".html")) {
  try {
    const source = readFileSync(path, "utf8");
    await format(source, {
      filepath: path,
      parser: "html",
    });
    if (!/<title>\S(?:.|\n)*?<\/title>/.test(source)) {
      failures.push(`${relative(".", path)}: missing a non-empty title`);
    }
  } catch (error) {
    failures.push(
      `${relative(".", path)}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("HTML syntax check passed.");
