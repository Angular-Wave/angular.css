import { existsSync, readdirSync, statSync } from "node:fs";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const componentNames = readdirSync("src/components")
  .filter((entry) => statSync(join("src/components", entry)).isDirectory())
  .filter((entry) => existsSync(join("src/components", entry, `${entry}.ts`)))
  .sort();

const listTypeScriptFiles = (directory) =>
  readdirSync(directory)
    .flatMap((entry) => {
      const path = join(directory, entry);
      return statSync(path).isDirectory() ? listTypeScriptFiles(path) : path;
    })
    .filter((path) => path.endsWith(".ts") && !path.endsWith(".test.ts"));

const elementNames = [
  ...new Set(
    listTypeScriptFiles("src/elements").map((path) =>
      path.split("/").at(-1).replace(/\.ts$/, ""),
    ),
  ),
].sort();

const failures = [];

const checkDocsPage = ({
  componentName,
  docsPage,
  expectedExample,
  sectionName,
}) => {
  if (!existsSync(docsPage)) {
    failures.push(`${componentName}: missing ${sectionName} docs page ${docsPage}`);
    return;
  }

  const docsSource = readFileSync(docsPage, "utf8");
  const title = docsSource.match(/^title:\s*(.+)$/m)?.[1]?.trim();

  if (title !== componentName) {
    failures.push(
      `${componentName}: ${sectionName} docs title must be "${componentName}"`,
    );
  }

  if (!/^description:\s*>/m.test(docsSource)) {
    failures.push(`${componentName}: ${sectionName} docs must include description`);
  }

  if (!docsSource.includes(expectedExample)) {
    failures.push(`${componentName}: ${sectionName} docs must embed ${expectedExample}`);
  }
};

for (const componentName of componentNames) {
  const docsPage = join("docs/content/docs/components", `${componentName}.md`);
  const examplePage = join(
    "docs/static/examples/components",
    `${componentName}.html`,
  );

  checkDocsPage({
    componentName,
    docsPage,
    expectedExample: `src="examples/components/${componentName}.html"`,
    sectionName: "component",
  });

  if (!existsSync(examplePage)) {
    failures.push(
      `${componentName}: missing component iframe example ${examplePage}`,
    );
  }
}

for (const elementName of elementNames) {
  const docsPage = join("docs/content/docs/elements", `${elementName}.md`);
  const examplePage = join(
    "docs/static/examples/elements",
    `${elementName}.html`,
  );

  checkDocsPage({
    componentName: elementName,
    docsPage,
    expectedExample: `src="examples/elements/${elementName}.html"`,
    sectionName: "element",
  });

  if (!existsSync(examplePage)) {
    failures.push(`${elementName}: missing element iframe example ${examplePage}`);
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Docs inventory check passed.");
