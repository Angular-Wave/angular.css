import { appendFileSync, readFileSync } from "node:fs";

import {
  extractReleaseNotes,
  readJson,
  releaseDetails,
  validateManifest,
  validatePack,
  validateRegistryPublication,
} from "./release-utils.mjs";

const [command = "validate", argument] = process.argv.slice(2);
const manifest = readJson("package.json");

if (command === "validate") {
  const details = releaseDetails(manifest, argument);
  validateManifest(manifest);
  extractReleaseNotes(readFileSync("CHANGELOG.md", "utf8"), details.version);

  const docsConfig = readFileSync("docs/hugo.yaml", "utf8");
  if (!docsConfig.includes(`version: ${details.version}`)) {
    throw new Error(`docs/hugo.yaml must contain version: ${details.version}`);
  }

  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(
      process.env.GITHUB_OUTPUT,
      [
        `name=${details.name}`,
        `npm_tag=${details.npmTag}`,
        `prerelease=${String(details.prerelease)}`,
        `tag=${details.tag}`,
        `version=${details.version}`,
        "",
      ].join("\n"),
    );
  } else {
    console.log(
      `Release metadata is valid for ${details.name}@${details.version}.`,
    );
  }
} else if (command === "notes") {
  const version = argument ?? manifest.version;
  console.log(
    extractReleaseNotes(readFileSync("CHANGELOG.md", "utf8"), version),
  );
} else if (command === "verify-pack") {
  if (!argument) throw new Error("verify-pack requires an npm pack JSON file");
  const [pack] = readJson(argument);
  validatePack(pack, manifest);
  console.log(`Packed artifact is valid: ${pack.filename}`);
} else if (command === "registry") {
  const response = await fetch(
    `https://registry.npmjs.org/${encodeURIComponent(manifest.name)}`,
  );
  if (response.status !== 200 && response.status !== 404) {
    throw new Error(`npm registry lookup failed with HTTP ${response.status}`);
  }

  const packageExists = response.status === 200;
  const metadata = packageExists ? await response.json() : { versions: {} };
  const versionExists = manifest.version in (metadata.versions ?? {});
  const values = {
    package_exists: String(packageExists),
    version_exists: String(versionExists),
  };
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(
      process.env.GITHUB_OUTPUT,
      `${Object.entries(values)
        .map(([key, value]) => `${key}=${value}`)
        .join("\n")}\n`,
    );
  } else {
    console.log(JSON.stringify(values));
  }
} else if (command === "verify-registry") {
  if (!argument) {
    throw new Error("verify-registry requires an npm pack JSON file");
  }
  const [pack] = readJson(argument);
  const details = releaseDetails(manifest);
  let lastError;

  for (let attempt = 1; attempt <= 20; attempt += 1) {
    try {
      const response = await fetch(
        `https://registry.npmjs.org/${encodeURIComponent(manifest.name)}`,
      );
      if (!response.ok) {
        throw new Error(
          `npm registry lookup failed with HTTP ${response.status}`,
        );
      }
      validateRegistryPublication(
        await response.json(),
        pack,
        details,
        details.npmTag,
      );
      console.log(
        `Published artifact verified: ${details.name}@${details.version} (${pack.integrity}).`,
      );
      lastError = undefined;
      break;
    } catch (error) {
      lastError = error;
      if (attempt < 20) {
        await new Promise((resolve) => setTimeout(resolve, 3_000));
      }
    }
  }

  if (lastError) {
    throw new Error(
      `npm publication did not become verifiable: ${lastError.message}`,
      { cause: lastError },
    );
  }
} else {
  throw new Error(`Unknown release command: ${command}`);
}
