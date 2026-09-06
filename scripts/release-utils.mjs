import { readFileSync } from "node:fs";

export const versionPattern =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;

export function releaseDetails(manifest, requestedTag) {
  const version = manifest.version;
  if (!versionPattern.test(version)) {
    throw new Error(
      `package.json contains an invalid release version: ${version}`,
    );
  }

  const tag = requestedTag ?? `v${version}`;
  if (tag !== `v${version}`) {
    throw new Error(
      `Release tag ${tag} must exactly match package version v${version}`,
    );
  }

  return {
    name: manifest.name,
    npmTag: version.includes("-") ? "next" : "latest",
    prerelease: version.includes("-"),
    tag,
    version,
  };
}

export function extractReleaseNotes(changelog, requestedVersion) {
  const version = requestedVersion.startsWith("v")
    ? requestedVersion.slice(1)
    : requestedVersion;
  if (!versionPattern.test(version)) {
    throw new Error(`Invalid release version: ${requestedVersion}`);
  }

  const heading = new RegExp(
    `^## \\[${escapeRegExp(version)}\\] - \\d{4}-\\d{2}-\\d{2}\\s*$`,
    "m",
  );
  const match = heading.exec(changelog);
  if (!match) {
    throw new Error(
      `CHANGELOG.md must contain a "## [${version}] - YYYY-MM-DD" section`,
    );
  }

  const remainder = changelog.slice(match.index + match[0].length);
  const nextHeading = /^## /m.exec(remainder);
  const notes = remainder
    .slice(0, nextHeading ? nextHeading.index : remainder.length)
    .trim();
  if (!notes || !/\S/.test(notes.replace(/<!--[^]*?-->/g, ""))) {
    throw new Error(`CHANGELOG.md release section ${version} is empty`);
  }
  return notes;
}

export function validateManifest(manifest) {
  const requiredFiles = ["@types", "dist", "README.md", "LICENSE"];
  const files = new Set(manifest.files ?? []);
  const missingFiles = requiredFiles.filter((file) => !files.has(file));
  if (missingFiles.length) {
    throw new Error(
      `package.json files is missing: ${missingFiles.join(", ")}`,
    );
  }

  if (manifest.publishConfig?.access !== "public") {
    throw new Error("package.json publishConfig.access must be public");
  }
  if (manifest.publishConfig?.registry !== "https://registry.npmjs.org/") {
    throw new Error("package.json must publish to the public npm registry");
  }

  const exports = manifest.exports ?? {};
  for (const path of [".", "./angular.css", "./package.json"]) {
    if (!(path in exports)) {
      throw new Error(`package.json exports is missing ${path}`);
    }
  }
}

export function validatePack(pack, expected) {
  if (pack.name !== expected.name || pack.version !== expected.version) {
    throw new Error(
      `Packed ${pack.name}@${pack.version}; expected ${expected.name}@${expected.version}`,
    );
  }
  if (pack.warnings?.length) {
    throw new Error(`npm pack warnings: ${pack.warnings.join("; ")}`);
  }

  const included = new Set((pack.files ?? []).map(({ path }) => path));
  const required = [
    "@types/index.d.ts",
    "LICENSE",
    "README.md",
    "dist/angular.css",
    "dist/angular-css.esm.js",
    "dist/angular-css.umd.js",
    "dist/angular-css.umd.min.js",
    "package.json",
  ];
  const missing = required.filter((path) => !included.has(path));
  if (missing.length) {
    throw new Error(`Packed artifact is missing: ${missing.join(", ")}`);
  }

  const unexpected = [...included].filter(
    (path) =>
      path.startsWith("src/") ||
      path.startsWith("docs/") ||
      path.startsWith("examples/") ||
      path.startsWith("test-results/"),
  );
  if (unexpected.length) {
    throw new Error(
      `Packed artifact contains development files: ${unexpected.join(", ")}`,
    );
  }
}

export function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
