import {
  existsSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { spawnSync } from "node:child_process";

import { catalogNames } from "./component-policy.ts";

const outputDirectory = join("/tmp", `angularcss-docs-check-${process.pid}`);
const basePath = "/angular.css/";

const listFiles = (directory: string): string[] =>
  readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    return statSync(path).isDirectory() ? listFiles(path) : path;
  });

const build = spawnSync(
  "hugo",
  [
    "--source",
    "docs",
    "--destination",
    outputDirectory,
    "--cleanDestinationDir",
  ],
  { encoding: "utf8" },
);

if (build.status !== 0) {
  process.stderr.write(build.stdout ?? "");
  process.stderr.write(build.stderr ?? "");
  process.exit(build.status ?? 1);
}

const failures: string[] = [];

try {
  const htmlFiles = listFiles(outputDirectory).filter((file) =>
    file.endsWith(".html"),
  );

  for (const file of htmlFiles) {
    const html = readFileSync(file, "utf8");

    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const reference = match[1];
      if (
        !reference ||
        reference.startsWith("#") ||
        /^(?:https?:|mailto:|tel:|data:|javascript:)/.test(reference)
      ) {
        continue;
      }

      const path = reference.split(/[?#]/)[0];
      let target: string | undefined;

      if (path.startsWith(basePath)) {
        target = join(outputDirectory, path.slice(basePath.length));
      } else if (path === basePath.slice(0, -1)) {
        target = outputDirectory;
      } else if (!path.startsWith("/")) {
        target = resolve(dirname(file), path);
      }

      if (
        target &&
        !existsSync(target) &&
        !existsSync(join(target, "index.html"))
      ) {
        failures.push(
          `${relative(outputDirectory, file)}: missing local reference ${reference}`,
        );
      }
    }
  }

  const componentIndex = readFileSync(
    join(outputDirectory, "docs/components/index.html"),
    "utf8",
  );
  if (!componentIndex.includes("component-catalog-group")) {
    failures.push("component catalog did not render grouped component links");
  }

  const home = readFileSync(join(outputDirectory, "index.html"), "utf8");
  const homeComponentLinks = [
    ...home.matchAll(/class="component-catalog-list"[\s\S]*?<\/ul>/g),
  ].flatMap((section) => [
    ...section[0].matchAll(
      /href="[^"]*\/docs\/(?:foundations|elements|patterns|components|recipes)\/[^"/]+\/"/g,
    ),
  ]);
  if (homeComponentLinks.length !== catalogNames.length) {
    failures.push(
      `homepage must link all ${catalogNames.length} catalog entries; found ${homeComponentLinks.length}`,
    );
  }

  const accordionReference = readFileSync(
    join(outputDirectory, "docs/patterns/accordion/index.html"),
    "utf8",
  );
  for (const expected of [
    "View source",
    "Installation",
    "Anatomy",
    "API",
    "Behavior",
    "Accessibility",
    "Customization",
  ]) {
    if (!accordionReference.includes(expected)) {
      failures.push(`component reference is missing ${expected}`);
    }
  }

  const config = readFileSync("docs/hugo.yaml", "utf8");
  if (/USERNAME|https:\/\/example\.com/.test(config)) {
    failures.push("docs/hugo.yaml contains publication placeholders");
  }

  if (failures.length > 0) {
    console.error(failures.join("\n"));
    process.exitCode = 1;
  } else {
    console.log(
      `Docs site check passed for ${htmlFiles.length} generated HTML files.`,
    );
  }
} finally {
  rmSync(outputDirectory, { force: true, recursive: true });
}
