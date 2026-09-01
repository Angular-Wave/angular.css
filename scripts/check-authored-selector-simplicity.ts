import { readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

import { componentPolicy } from "./component-policy.ts";

const roots = [
  "src",
  "docs/content",
  "docs/static/examples",
  "docs/tests",
  "examples",
  "scripts",
];
const rootFiles = ["CONTRIBUTING.md", "README.md", "index.html"];
const extensions = new Set([".css", ".html", ".js", ".md", ".mjs", ".ts"]);
const removedSlotAttribute = `data-${"slot"}`;
const removedInputAttribute = `data-${"input"}`;
const componentNames = new Set(readdirSync("src/components"));
const elementNames = new Set(
  Object.entries(componentPolicy)
    .filter(([, policy]) => policy.kind === "element")
    .map(([name]) => name),
);
const componentPrefixes = [...componentNames].sort(
  (left, right) => right.length - left.length,
);
const rootAliases = new Set(["resizable-panel-group", "toaster"]);

const filesIn = (directory: string): string[] =>
  readdirSync(directory)
    .flatMap((entry) => {
      const path = join(directory, entry);
      return statSync(path).isDirectory() ? filesIn(path) : path;
    })
    .filter((path) => extensions.has(extname(path)));

const files = [...roots.flatMap(filesIn), ...rootFiles];
const failures: string[] = [];

for (const path of files) {
  const source = readFileSync(path, "utf8");
  const displayPath = relative(".", path);

  if (source.includes(removedSlotAttribute)) {
    failures.push(`${displayPath}: removed slot attribute is not allowed`);
  }

  if (source.includes(removedInputAttribute)) {
    failures.push(
      `${displayPath}: removed input styling attribute; use .input`,
    );
  }

  if ([".html", ".md"].includes(extname(path))) {
    const danglingAttribute = source.match(
      /<[a-z][^>]*\s-[a-z][a-z0-9-]*(?=\s|=|>)/i,
    );
    if (danglingAttribute) {
      failures.push(
        `${displayPath}: malformed attribute begins with a hyphen (${danglingAttribute[0].trim()})`,
      );
    }

    const roleMatch = source.match(/\srole=(["'])[^"']+\1/i);
    if (roleMatch) {
      failures.push(
        `${displayPath}: authored roles are directive-owned (${roleMatch[0].trim()})`,
      );
    }

    const invalidCustomElement = source.match(
      /<\/?(?:fieldset-group|fieldset-otp)\b/i,
    );
    if (invalidCustomElement) {
      failures.push(
        `${displayPath}: invalid migrated element ${invalidCustomElement[0]}`,
      );
    }

    for (const tag of source.match(/<[a-z][^>]*>/gis) ?? []) {
      for (const match of tag.matchAll(/\sng-([a-z][a-z0-9-]*)/g)) {
        const name = match[1];
        if (elementNames.has(name)) {
          failures.push(
            `${displayPath}: [ng-${name}] is styling-only; use native HTML and .${name}`,
          );
          continue;
        }
        if (componentNames.has(name) || rootAliases.has(name)) continue;
        const owner = componentPrefixes.find((prefix) =>
          name.startsWith(`${prefix}-`),
        );
        if (owner) {
          failures.push(
            `${displayPath}: [ng-${name}] is a child marker; [ng-${owner}] must inspect its own semantic contents`,
          );
        }
      }
    }

    if (extname(path) === ".md") {
      for (const match of source.matchAll(/\bng-([a-z][a-z0-9-]*)/g)) {
        const name = match[1];
        if (componentNames.has(name) || rootAliases.has(name)) continue;
        if (elementNames.has(name)) {
          failures.push(
            `${displayPath}: documentation advertises styling-only ng-${name}`,
          );
          continue;
        }
        const owner = componentPrefixes.find((prefix) =>
          name.startsWith(`${prefix}-`),
        );
        if (owner) {
          failures.push(
            `${displayPath}: documentation advertises child marker ng-${name}; ng-${owner} must inspect semantic descendants`,
          );
        }
      }
    }
  }

  if (extname(path) === ".css") {
    if (/\[role(?:=|\])/i.test(source)) {
      failures.push(`${displayPath}: CSS must not use roles as styling hooks`);
    }

    for (const match of source.matchAll(/\[ng-([a-z][a-z0-9-]*)\]/g)) {
      const name = match[1];
      if (elementNames.has(name)) {
        failures.push(
          `${displayPath}: CSS targets styling-only [ng-${name}]; use .${name}`,
        );
        continue;
      }
      if (componentNames.has(name) || rootAliases.has(name)) continue;
      const owner = componentPrefixes.find((prefix) =>
        name.startsWith(`${prefix}-`),
      );
      if (owner) {
        failures.push(
          `${displayPath}: CSS targets child marker [ng-${name}]; use .${name}`,
        );
      } else {
        failures.push(
          `${displayPath}: CSS targets unregistered [ng-${name}]; use semantic HTML or a class`,
        );
      }
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(
  "Semantic authored-selector check passed: no slot attributes, authored roles, role selectors, or child component markers.",
);
