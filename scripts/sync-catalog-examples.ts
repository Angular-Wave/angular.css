import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { catalogNames, catalogPolicy } from "./component-policy.ts";

const adoptDocs = process.argv.includes("--adopt-docs");
const checkOnly = process.argv.includes("--check");
const failures: string[] = [];

const sourceAssets = (html: string): string =>
  html
    .replaceAll("../../css/preflight.css", "/docs/static/css/preflight.css")
    .replaceAll("../../css/angular.css", "/docs/static/css/angular.css")
    .replaceAll("../example.css", "/docs/static/examples/example.css")
    .replaceAll("../../js/", "/docs/static/js/")
    .replaceAll("/docs/assets/angular.css", "/docs/static/css/angular.css");

const publishedAssets = (html: string): string =>
  html
    .replaceAll("/docs/static/css/preflight.css", "../../css/preflight.css")
    .replaceAll("/docs/static/css/angular.css", "../../css/angular.css")
    .replaceAll("/docs/static/examples/example.css", "../example.css")
    .replaceAll("/docs/static/js/", "../../js/");

for (const name of catalogNames) {
  const { category } = catalogPolicy[name];
  const sourcePath = join("src", category, name, `${name}.html`);
  const publishedPath = join("docs/static/examples/components", `${name}.html`);
  const inputPath = adoptDocs ? publishedPath : sourcePath;
  const outputPath = adoptDocs ? sourcePath : publishedPath;
  const expected = adoptDocs
    ? sourceAssets(readFileSync(inputPath, "utf8"))
    : publishedAssets(readFileSync(inputPath, "utf8"));

  if (checkOnly) {
    if (readFileSync(outputPath, "utf8") !== expected)
      failures.push(outputPath);
  } else {
    writeFileSync(outputPath, expected);
  }
}

if (failures.length > 0) {
  console.error("Catalog examples are stale:");
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(
  checkOnly
    ? `Catalog example check passed for ${catalogNames.length} entries.`
    : `${adoptDocs ? "Adopted" : "Published"} ${catalogNames.length} catalog examples.`,
);
