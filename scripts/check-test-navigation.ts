import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const listTestFiles = (directory: string): string[] =>
  readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) return listTestFiles(path);
    return path.endsWith(".test.ts") ? [path] : [];
  });

const testFiles = ["src", "docs/tests"]
  .filter(existsSync)
  .flatMap(listTestFiles);
const failures: string[] = [];
const checkedArtifactPages = new Set<string>();
const checkedSourcePages = new Set<string>();
const canonicalComponents = readdirSync("src/components")
  .filter((entry) => statSync(join("src/components", entry)).isDirectory())
  .filter((entry) => existsSync(join("src/components", entry, `${entry}.ts`)));

const checkArtifactPage = (testFile: string, target: string): void => {
  if (
    !/^\/docs\/static\/examples\/(?:components|elements)\/[^?#]+\.html$/.test(
      target,
    )
  ) {
    return;
  }

  const pagePath = target.slice(1);
  if (!existsSync(pagePath) || checkedArtifactPages.has(pagePath)) return;
  checkedArtifactPages.add(pagePath);

  const html = readFileSync(pagePath, "utf8");
  const requiredBundles = [
    "../../js/angular-ts.umd.js",
    "../../js/angular-css.umd.js",
  ];

  for (const bundle of requiredBundles) {
    if (!html.includes(`<script src="${bundle}"></script>`)) {
      failures.push(
        `${testFile}: tested artifact page ${target} must load local built bundle ${bundle}`,
      );
    }
  }

  if (
    /<script\b[^>]*\bsrc=["'][^"']*(?:\/src\/|\.tsx?(?:[?#][^"']*)?)["']/i.test(
      html,
    ) ||
    /\bimport\s*\(\s*["'`][^"'`]*\/src\/(?:components|elements)\//.test(html)
  ) {
    failures.push(
      `${testFile}: tested artifact page ${target} references TypeScript component source`,
    );
  }
};

const checkSourcePage = (testFile: string, target: string): void => {
  if (!/^\/src\/(?:components|elements)\/[^?#]+\.html$/.test(target)) return;

  const pagePath = target.slice(1);
  if (!existsSync(pagePath)) {
    failures.push(
      `${testFile}: source HTML navigation target does not exist ${target}`,
    );
    return;
  }
  if (checkedSourcePages.has(pagePath)) return;
  checkedSourcePages.add(pagePath);

  const html = readFileSync(pagePath, "utf8");
  const requiredBundles = [
    "/docs/static/js/angular-ts.umd.js",
    "/docs/static/js/angular-css.umd.js",
  ];

  for (const bundle of requiredBundles) {
    if (!html.includes(`<script src="${bundle}"></script>`)) {
      failures.push(
        `${testFile}: tested source page ${target} must load local built bundle ${bundle}`,
      );
    }
  }

  if (
    /<script\b[^>]*\bsrc=["'][^"']*(?:\/src\/|\.tsx?(?:[?#][^"']*)?)["']/i.test(
      html,
    ) ||
    /\bimport\s*\(\s*["'`][^"'`]*\/src\/(?:components|elements)\//.test(html)
  ) {
    failures.push(
      `${testFile}: tested source page ${target} references TypeScript component source`,
    );
  }
};

for (const file of testFiles) {
  const source = readFileSync(file, "utf8");

  for (const match of source.matchAll(
    /["'`](\/src\/(?:components|elements)\/[^"'`?#]+\.html)["'`]/g,
  )) {
    checkSourcePage(file, match[1]);
  }

  for (const match of source.matchAll(
    /["'`](\/docs\/static\/examples\/(?:components|elements)\/[^"'`?#]+\.html)["'`]/g,
  )) {
    checkArtifactPage(file, match[1]);
  }

  for (const match of source.matchAll(/page\.goto\(["'`]([^"'`]+)["'`]\)/g)) {
    const target = match[1];

    if (target.includes("${component}")) {
      for (const component of canonicalComponents) {
        const expandedTarget = target.replace("${component}", component);
        if (
          expandedTarget.startsWith("/docs/static/") &&
          !existsSync(expandedTarget.slice(1))
        ) {
          failures.push(
            `${file}: expanded browser navigation target does not exist ${expandedTarget}`,
          );
        }
        checkArtifactPage(file, expandedTarget);
      }
      continue;
    }

    if (/\.tsx?(?:[?#]|$)/.test(target)) {
      failures.push(
        `${file}: browser navigation targets source file ${target}`,
      );
    }

    if (target.startsWith("/docs/static/") && !existsSync(target.slice(1))) {
      failures.push(
        `${file}: browser navigation target does not exist ${target}`,
      );
    }
    checkSourcePage(file, target);
    checkArtifactPage(file, target);
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(
  `Test navigation check passed for ${testFiles.length} browser test files, ${checkedSourcePages.size} source HTML pages, and ${checkedArtifactPages.size} built HTML artifacts.`,
);
