import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, join } from "node:path";

const listTypeScriptFiles = (directory) =>
  readdirSync(directory)
    .flatMap((entry) => {
      const path = join(directory, entry);
      return statSync(path).isDirectory() ? listTypeScriptFiles(path) : path;
    })
    .filter((path) => path.endsWith(".ts") && !path.endsWith(".test.ts"));

const failures = [];

for (const file of listTypeScriptFiles("src/elements")) {
  const source = readFileSync(file, "utf8").trim();
  const componentName = basename(file, ".ts");
  const componentPath = `src/components/${componentName}/${componentName}.ts`;
  const expectedImport = `../../components/${componentName}/${componentName}`;
  const expectedPattern = new RegExp(
    `^export \\{ [A-Za-z0-9_$]+ \\} from "${expectedImport.replaceAll("/", "\\/")}";$`,
  );

  if (!existsSync(componentPath)) {
    failures.push(`${file}: missing canonical component file ${componentPath}`);
    continue;
  }

  if (!expectedPattern.test(source)) {
    failures.push(
      `${file}: element entrypoints must re-export ${expectedImport}`,
    );
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Element entrypoint check passed.");
