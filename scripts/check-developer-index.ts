import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const componentNames = readdirSync("src/components")
  .filter((entry) => statSync(join("src/components", entry)).isDirectory())
  .filter((entry) => existsSync(join("src/components", entry, `${entry}.ts`)))
  .sort();

const indexSource = readFileSync("index.html", "utf8");
const linkedComponents = [
  ...indexSource.matchAll(
    /href="\.\/docs\/static\/examples\/components\/([^"/]+)\.html"/g,
  ),
]
  .map(([, component]) => component)
  .sort();

const failures: string[] = [];

if (JSON.stringify(linkedComponents) !== JSON.stringify(componentNames)) {
  const missing = componentNames.filter(
    (component) => !linkedComponents.includes(component),
  );
  const unexpected = linkedComponents.filter(
    (component) => !componentNames.includes(component),
  );

  if (missing.length > 0) {
    failures.push(`index.html: missing component links: ${missing.join(", ")}`);
  }
  if (unexpected.length > 0) {
    failures.push(
      `index.html: unexpected or duplicate component links: ${unexpected.join(", ")}`,
    );
  }
  if (missing.length === 0 && unexpected.length === 0) {
    failures.push("index.html: component links must appear exactly once");
  }
}

for (const component of linkedComponents) {
  const example = join("docs/static/examples/components", `${component}.html`);
  if (!existsSync(example)) {
    failures.push(`index.html: linked example does not exist: ${example}`);
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(
  `Developer index check passed for ${componentNames.length} components.`,
);
