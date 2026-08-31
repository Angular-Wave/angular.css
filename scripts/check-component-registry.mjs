import { readdirSync, readFileSync, statSync } from "node:fs";
import { basename, join } from "node:path";

const indexSource = readFileSync("src/index.ts", "utf8");

const listCanonicalComponentFiles = () =>
  readdirSync("src/components")
    .flatMap((entry) => {
      const directory = join("src/components", entry);
      if (!statSync(directory).isDirectory()) return [];

      const file = join(directory, `${entry}.ts`);
      try {
        return statSync(file).isFile() ? [file] : [];
      } catch {
        return [];
      }
    })
    .sort();

const imports = new Map(
  [
    ...indexSource.matchAll(
      /import \{ ([A-Za-z0-9_$]+) \} from "\.\/components\/([^"]+)";/g,
    ),
  ].map(([, symbol, path]) => [path, symbol]),
);

const registrations = new Map(
  [...indexSource.matchAll(/\["([^"]+)",\s*([A-Za-z0-9_$]+)\]/g)].map(
    ([, directive, symbol]) => [symbol, directive],
  ),
);

const failures = [];
const stylingOnlyComponents = new Set(["input"]);

for (const file of listCanonicalComponentFiles()) {
  const componentName = basename(file, ".ts");
  const importPath = `${componentName}/${componentName}`;
  const source = readFileSync(file, "utf8");
  const exportedDirective = source.match(
    /export function ([A-Za-z0-9_$]+Directive)\(/,
  )?.[1];

  if (!exportedDirective) {
    failures.push(
      `${file}: canonical component must export a directive factory`,
    );
    continue;
  }

  if (stylingOnlyComponents.has(componentName)) {
    if (registrations.has(exportedDirective)) {
      failures.push(
        `${file}: styling-only ${exportedDirective} must not be registered`,
      );
    }
    continue;
  }

  const importedDirective = imports.get(importPath);
  if (importedDirective !== exportedDirective) {
    failures.push(
      `${file}: src/index.ts must import ${exportedDirective} from ./components/${importPath}`,
    );
    continue;
  }

  if (!registrations.has(exportedDirective)) {
    failures.push(
      `${file}: ${exportedDirective} is not registered in src/index.ts`,
    );
  }
}

for (const [importPath] of imports) {
  const [directory, fileName] = importPath.split("/");
  if (directory !== fileName) {
    failures.push(
      `src/index.ts: component imports must use canonical paths, found ./components/${importPath}`,
    );
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Component registry check passed.");
