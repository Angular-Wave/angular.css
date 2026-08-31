import { readdirSync, readFileSync, statSync } from "node:fs";
import { basename, join } from "node:path";

const listTypeScriptFiles = (directory) =>
  readdirSync(directory)
    .flatMap((entry) => {
      const path = join(directory, entry);
      return statSync(path).isDirectory() ? listTypeScriptFiles(path) : path;
    })
    .filter((path) => path.endsWith(".ts") && !path.endsWith(".test.ts"));

const failures = [];

for (const file of listTypeScriptFiles("src/components")) {
  const componentName = basename(file, ".ts");
  const directoryName = basename(file.split("/").slice(0, -1).join("/"));
  if (componentName !== directoryName) continue;

  const source = readFileSync(file, "utf8").trim();
  if (/^export \{ [A-Za-z0-9_$]+ \} from "\.\.\/[^"]+";$/.test(source)) {
    failures.push(`${file}: canonical component files must own implementation`);
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Component entrypoint check passed.");
