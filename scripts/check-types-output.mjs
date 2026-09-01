import { existsSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

import { componentNames } from "./component-policy.ts";

const listFiles = (directory) => {
  if (!existsSync(directory)) return [];

  return readdirSync(directory)
    .flatMap((entry) => {
      const path = join(directory, entry);
      return statSync(path).isDirectory() ? listFiles(path) : path;
    })
    .sort();
};

const expectedComponentTypes = new Set(
  componentNames.map((name) => join("@types", "components", name, `${name}.d.ts`)),
);

const actualComponentTypes = listFiles(join("@types", "components")).filter((path) =>
  path.endsWith(".d.ts"),
);

const failures = [];

if (!existsSync(join("@types", "index.d.ts"))) {
  failures.push("@types/index.d.ts is missing; run npm run build:types");
}

for (const componentType of expectedComponentTypes) {
  if (!existsSync(componentType)) {
    failures.push(`${componentType} is missing; run npm run build:types`);
  }
}

for (const componentType of actualComponentTypes) {
  if (!expectedComponentTypes.has(componentType)) {
    failures.push(
      `${componentType} is not a canonical component declaration output`,
    );
  }
}

for (const forbiddenDirectory of [join("@types", "src"), join("@types", "elements")]) {
  if (existsSync(forbiddenDirectory)) {
    failures.push(
      `${forbiddenDirectory} must not be emitted; declarations should follow src canonical exports`,
    );
  }
}

const sourceFiles = new Set(
  listFiles("src")
    .filter((path) => path.endsWith(".ts") && !path.endsWith(".test.ts"))
    .map((path) => relative("src", path)),
);

for (const declarationFile of listFiles("@types").filter((path) =>
  path.endsWith(".d.ts"),
)) {
  const relativeDeclaration = relative("@types", declarationFile).replace(
    /\.d\.ts$/,
    ".ts",
  );

  if (
    !relativeDeclaration.startsWith("components/") &&
    !relativeDeclaration.startsWith("internal/") &&
    relativeDeclaration !== "index.ts"
  ) {
    failures.push(`${declarationFile} is outside the public declaration layout`);
  }

  if (
    relativeDeclaration.startsWith("components/") &&
    !sourceFiles.has(relativeDeclaration)
  ) {
    failures.push(`${declarationFile} does not map to a source TypeScript file`);
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Types output check passed.");
