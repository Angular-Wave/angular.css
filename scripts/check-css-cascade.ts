import { readFileSync } from "node:fs";

const indexCss = readFileSync("src/index.css", "utf8");
const preflightCss = readFileSync("src/preflight.css", "utf8");
const failures: string[] = [];
const expectedOrder =
  "@layer theme, base, angularcss.tokens, angularcss.components, components, utilities;";

if (!indexCss.startsWith(expectedOrder)) {
  failures.push(`src/index.css must begin with ${expectedOrder}`);
}

for (const match of indexCss.matchAll(/^@import "\.\/components\/[^;]+;/gm)) {
  if (!match[0].trimEnd().endsWith("layer(angularcss.components);")) {
    failures.push(`component import is outside angularcss.components: ${match[0]}`);
  }
}

for (const match of indexCss.matchAll(/^@import "@radix-ui\/colors\/[^\n]+$/gm)) {
  if (!match[0].endsWith(" layer(angularcss.tokens);")) {
    failures.push(`color import is outside angularcss.tokens: ${match[0]}`);
  }
}

if (!preflightCss.includes('layer(base)')) {
  failures.push("src/preflight.css must import Tailwind preflight into base");
}

if (failures.length > 0) {
  throw new Error(`CSS cascade contract failed:\n${failures.join("\n")}`);
}

console.log("CSS cascade contract passed.");
