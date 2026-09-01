import { existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const packageName = "@angular-wave/angular.ts";
const manifest = JSON.parse(readFileSync("package.json", "utf8"));
const declaredVersion = manifest.dependencies?.[packageName];
const failures = [];

if (declaredVersion !== "latest") {
  failures.push(
    `${packageName} must use the exact \"latest\" npm tag; found ${JSON.stringify(declaredVersion)}.`,
  );
}

const installedManifestPath = `node_modules/${packageName}/package.json`;
let installedVersion;

if (!existsSync(installedManifestPath)) {
  failures.push(`${packageName} is not installed; run npm install.`);
} else {
  installedVersion = JSON.parse(
    readFileSync(installedManifestPath, "utf8"),
  ).version;
}

if (installedVersion && existsSync("package-lock.json")) {
  const lockfile = JSON.parse(readFileSync("package-lock.json", "utf8"));
  const lockedDeclaration =
    lockfile.packages?.[""]?.dependencies?.[packageName];
  const lockedVersion =
    lockfile.packages?.[`node_modules/${packageName}`]?.version;

  if (lockedDeclaration !== "latest") {
    failures.push(
      `package-lock.json must declare ${packageName} as \"latest\"; found ${JSON.stringify(lockedDeclaration)}.`,
    );
  }

  if (lockedVersion !== installedVersion) {
    failures.push(
      `${packageName} installation (${installedVersion}) does not match package-lock.json (${lockedVersion}); run npm install.`,
    );
  }
}

if (installedVersion) {
  let latestVersion;

  try {
    latestVersion = execFileSync(
      "npm",
      ["view", packageName, "dist-tags.latest", "--json"],
      { encoding: "utf8", timeout: 15_000 },
    ).trim();
    latestVersion = JSON.parse(latestVersion);
  } catch {
    failures.push(
      `Unable to resolve the latest ${packageName} version from npm.`,
    );
  }

  if (latestVersion && installedVersion !== latestVersion) {
    failures.push(
      `${packageName} ${installedVersion} is installed, but npm latest is ${latestVersion}; run npm install ${packageName}@latest --save.`,
    );
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(
  `AngularTS dependency policy passed: latest (${installedVersion}).`,
);
