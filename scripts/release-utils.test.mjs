import assert from "node:assert/strict";
import test from "node:test";

import {
  extractReleaseNotes,
  releaseDetails,
  validateManifest,
  validatePack,
  validateRegistryPublication,
} from "./release-utils.mjs";

test("release details require a matching semantic version tag", () => {
  assert.deepEqual(releaseDetails({ name: "package", version: "0.0.1" }), {
    name: "package",
    npmTag: "latest",
    prerelease: false,
    tag: "v0.0.1",
    version: "0.0.1",
  });
  assert.throws(
    () => releaseDetails({ name: "package", version: "0.0.1" }, "v0.0.2"),
    /must exactly match/,
  );
});

test("release notes select the requested changelog section", () => {
  const changelog = `# Changelog

## [Unreleased]

## [0.0.1] - 2026-09-06

- First release.

## [0.0.0] - 2026-09-05

- Scaffold.
`;
  assert.equal(extractReleaseNotes(changelog, "v0.0.1"), "- First release.");
  assert.throws(() => extractReleaseNotes(changelog, "0.0.2"), /must contain/);
});

test("manifest validation requires public package boundaries", () => {
  const manifest = {
    exports: {
      ".": {},
      "./angular.css": "./dist/angular.css",
      "./customization-tokens": "./tokens/angularcss.resolver.json",
      "./package.json": "./package.json",
    },
    files: ["@types", "dist", "tokens", "README.md", "LICENSE"],
    publishConfig: {
      access: "public",
      registry: "https://registry.npmjs.org/",
    },
  };
  assert.doesNotThrow(() => validateManifest(manifest));
  assert.throws(
    () => validateManifest({ ...manifest, files: ["dist"] }),
    /files is missing/,
  );
});

test("pack validation checks identity, runtime files, and package scope", () => {
  const files = [
    "@types/index.d.ts",
    "LICENSE",
    "README.md",
    "dist/angular.css",
    "dist/angular-css.esm.js",
    "dist/angular-css.umd.js",
    "dist/angular-css.umd.min.js",
    "package.json",
    "tokens/angularcss.resolver.json",
    "tokens/foundation/angularcss.tokens.json",
    "tokens/themes/dark.tokens.json",
  ].map((path) => ({ path }));
  const pack = {
    files,
    filename: "angular-wave-angular.css-0.0.1.tgz",
    name: "@angular-wave/angular.css",
    version: "0.0.1",
  };
  assert.doesNotThrow(() =>
    validatePack(pack, { name: pack.name, version: pack.version }),
  );
  assert.throws(
    () =>
      validatePack(
        { ...pack, files: [...files, { path: "src/index.ts" }] },
        pack,
      ),
    /development files/,
  );
});

test("registry validation requires the exact tarball and dist-tag", () => {
  const expected = {
    name: "@angular-wave/angular.css",
    version: "0.0.2",
  };
  const pack = {
    integrity: "sha512-local",
    shasum: "local-shasum",
  };
  const metadata = {
    "dist-tags": { latest: expected.version },
    versions: {
      [expected.version]: {
        ...expected,
        dist: {
          integrity: pack.integrity,
          shasum: pack.shasum,
        },
      },
    },
  };

  assert.doesNotThrow(() =>
    validateRegistryPublication(metadata, pack, expected, "latest"),
  );
  assert.throws(
    () =>
      validateRegistryPublication(
        {
          ...metadata,
          versions: {
            [expected.version]: {
              ...metadata.versions[expected.version],
              dist: {
                ...metadata.versions[expected.version].dist,
                integrity: "sha512-other",
              },
            },
          },
        },
        pack,
        expected,
        "latest",
      ),
    /integrity does not match/,
  );
  assert.throws(
    () =>
      validateRegistryPublication(
        { ...metadata, "dist-tags": { latest: "0.0.1" } },
        pack,
        expected,
        "latest",
      ),
    /dist-tag latest resolves to 0\.0\.1/,
  );
});
