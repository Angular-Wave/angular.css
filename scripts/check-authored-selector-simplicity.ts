import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { extname, join, relative } from "node:path";

const write = process.argv.includes("--write");
const roots = [
  "docs/content",
  "docs/static/examples",
  "examples",
  "src/components",
];
const extensions = new Set([".html", ".md"]);

const filesIn = (directory: string): string[] =>
  readdirSync(directory)
    .flatMap((entry) => {
      const path = join(directory, entry);
      return statSync(path).isDirectory() ? filesIn(path) : path;
    })
    .filter((path) => extensions.has(extname(path)));

const simplifyTag = (tag: string): { changed: boolean; tag: string } => {
  const slot = tag.match(/\sdata-slot=(['"])([a-z0-9-]+)\1/);
  if (!slot) return { changed: false, tag };

  const directive = new RegExp(`(?:\\s)ng-${slot[2]}(?:\\s|=|/?>)`);
  if (!directive.test(tag)) return { changed: false, tag };

  return {
    changed: true,
    tag: tag.replace(slot[0], ""),
  };
};

const failures: string[] = [];
let changedFiles = 0;
let redundantPairs = 0;

for (const path of roots.flatMap(filesIn)) {
  const source = readFileSync(path, "utf8");
  let filePairs = 0;
  const simplified = source.replace(/<[a-z][^>]*>/gis, (tag) => {
    const result = simplifyTag(tag);
    if (result.changed) filePairs += 1;
    return result.tag;
  });

  if (filePairs === 0) continue;
  redundantPairs += filePairs;
  if (write) {
    writeFileSync(path, simplified);
    changedFiles += 1;
  } else {
    failures.push(
      `${relative(".", path)}: ${filePairs} redundant same-name directive/slot pair${filePairs === 1 ? "" : "s"}`,
    );
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  console.error(
    "Use the ng-* directive as the authored selector and reserve data-slot for parts without directives.",
  );
  process.exit(1);
}

console.log(
  write
    ? `Removed ${redundantPairs} redundant selector pairs from ${changedFiles} files.`
    : "Authored selector simplicity check passed.",
);
