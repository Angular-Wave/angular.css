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
    await format(readFileSync(path, "utf8"), {
      filepath: path,
      parser: "html",
    });
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
