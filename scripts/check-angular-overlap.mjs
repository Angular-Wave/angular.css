import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import { catalogCategories } from "./component-policy.ts";

const indexSource = readFileSync("src/index.ts", "utf8");
const angularTypesSource = readFileSync(
  "node_modules/@angular-wave/angular.ts/@types/ng.d.ts",
  "utf8",
);

const registeredDirectives = [...indexSource.matchAll(/\["([^"]+)"\s*,/g)].map(
  (match) => match[1],
);

const angularBuiltInDirectives = new Set([
  ...[...angularTypesSource.matchAll(/\n\s{4}(ng[A-Za-z0-9_]+):/g)].map(
    (match) => match[1],
  ),
  ...[
    ...angularTypesSource.matchAll(
      /Record<([^>]+),\s*import\([^)]*\)\.DirectiveFactory>/g,
    ),
  ].flatMap((match) =>
    [...match[1].matchAll(/"(ng[A-Za-z0-9_]+)"/g)].map(
      (directive) => directive[1],
    ),
  ),
]);

const collisions = registeredDirectives.filter((directive) =>
  angularBuiltInDirectives.has(directive),
);

const listTypeScriptFiles = (directory) =>
  readdirSync(directory)
    .flatMap((entry) => {
      const path = join(directory, entry);
      return statSync(path).isDirectory() ? listTypeScriptFiles(path) : path;
    })
    .filter((path) => path.endsWith(".ts") && !path.endsWith(".test.ts"));

const overlapFailures = [];

if (collisions.length > 0) {
  overlapFailures.push(
    "AngularCSS must not register directives already provided by AngularTS.",
    ...collisions.map((directive) => `- ${directive}`),
  );
}

for (const file of catalogCategories.flatMap((category) =>
  listTypeScriptFiles(join("src", category)),
)) {
  const source = readFileSync(file, "utf8");

  const checks = [
    {
      message: "must not write component controller state onto AngularTS scope",
      pattern: /\bscope\.(?!\$on\b)/,
    },
    {
      message: "must not watch AngularTS scope state",
      pattern: /\$watch\b/,
    },
    {
      message: "must not trigger AngularTS digest/apply directly",
      pattern: /\$(?:apply|digest|eval)\b/,
    },
    {
      message: "must not require ngModel directly",
      pattern: /require:\s*["']ngModel["']/,
    },
    {
      message: "must not own native checked state",
      pattern: /\.checked\s*=/,
    },
  ];

  for (const { message, pattern } of checks) {
    if (pattern.test(source)) {
      overlapFailures.push(`${file}: ${message}`);
    }
  }

  if (/\.value\s*=/.test(source)) {
    overlapFailures.push(`${file}: must not own native value state`);
  }

  if (
    /dispatchEvent\(new Event\(["'](?:input|change)["']/.test(source)
  ) {
    overlapFailures.push(
      `${file}: must not synthesize native input/change events`,
    );
  }
}

if (overlapFailures.length > 0) {
  console.error(overlapFailures.join("\n"));
  process.exit(1);
}

console.log("AngularTS overlap check passed.");
