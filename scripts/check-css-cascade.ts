import { readFileSync } from "node:fs";

import { catalogNames, catalogPolicy } from "./component-policy.ts";

const indexCss = readFileSync("src/index.css", "utf8");
const preflightCss = readFileSync("src/preflight.css", "utf8");
const failures: string[] = [];
const expectedOrder =
  "@layer base, angularcss.tokens, angularcss.components, components, utilities;";

if (!indexCss.startsWith(expectedOrder)) {
  failures.push(`src/index.css must begin with ${expectedOrder}`);
}

const catalogImportPattern =
  /^@import "\.\/(foundations|elements|patterns|components|recipes)\/([^/]+)\/([^";]+\.css)"[^;]*;/gm;
const catalogImports = [...indexCss.matchAll(catalogImportPattern)];

for (const match of catalogImports) {
  if (!match[0].trimEnd().endsWith("layer(angularcss.components);")) {
    failures.push(
      `catalog import is outside angularcss.components: ${match[0]}`,
    );
  }
}

const actualCatalogImports = catalogImports.map(
  ([, category, directory, file]) => `${category}/${directory}/${file}`,
);
const expectedCatalogImports = catalogNames.map((name) => {
  const { category } = catalogPolicy[name];
  return `${category}/${name}/${name}.css`;
});

for (const expected of expectedCatalogImports) {
  const count = actualCatalogImports.filter((path) => path === expected).length;
  if (count !== 1) {
    failures.push(
      `src/index.css must import ${expected} exactly once; found ${count}`,
    );
  }
}

for (const actual of actualCatalogImports) {
  if (!expectedCatalogImports.includes(actual)) {
    failures.push(
      `src/index.css imports unregistered catalog stylesheet ${actual}`,
    );
  }
}

const tokenImport =
  '@import "./styles/generated/tokens.css" layer(angularcss.tokens);';
if (indexCss.split(tokenImport).length !== 2) {
  failures.push(
    "src/index.css must import generated customization tokens exactly once",
  );
}

if (!preflightCss.startsWith("@layer base {")) {
  failures.push(
    "src/preflight.css must define the documentation reset in base",
  );
}

if (failures.length > 0) {
  throw new Error(`CSS cascade contract failed:\n${failures.join("\n")}`);
}

console.log("CSS cascade contract passed.");
