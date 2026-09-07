import { gzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const budgets = JSON.parse(readFileSync("performance-budgets.json", "utf8"));
const failures = [];
const measurements = [];

for (const [path, budget] of Object.entries(budgets.artifacts)) {
  let contents;
  try {
    contents = readFileSync(path);
  } catch {
    failures.push(
      `${path}: missing; run npm run build before checking budgets`,
    );
    continue;
  }

  const bytes = contents.byteLength;
  const gzipBytes = gzipSync(contents).byteLength;
  measurements.push(`${path}: ${bytes} bytes, ${gzipBytes} bytes gzip`);
  if (bytes > budget.maximumBytes) {
    failures.push(
      `${path}: ${bytes} bytes exceeds ${budget.maximumBytes}-byte budget`,
    );
  }
  if (gzipBytes > budget.maximumGzipBytes) {
    failures.push(
      `${path}: ${gzipBytes} gzip bytes exceeds ${budget.maximumGzipBytes}-byte budget`,
    );
  }
}

const pack = spawnSync(
  process.platform === "win32" ? "npm.cmd" : "npm",
  ["pack", "--dry-run", "--ignore-scripts", "--json"],
  { encoding: "utf8" },
);
if (pack.status !== 0) {
  failures.push(`npm pack --dry-run failed:\n${pack.stderr || pack.stdout}`);
} else {
  const [result] = JSON.parse(pack.stdout);
  const packageMeasurements = {
    files: result.files.length,
    packedBytes: result.size,
    unpackedBytes: result.unpackedSize,
  };
  measurements.push(
    `package: ${packageMeasurements.packedBytes} packed bytes, ${packageMeasurements.unpackedBytes} unpacked bytes, ${packageMeasurements.files} files`,
  );
  if (packageMeasurements.files > budgets.package.maximumFiles) {
    failures.push(
      `package: ${packageMeasurements.files} files exceeds ${budgets.package.maximumFiles}-file budget`,
    );
  }
  if (packageMeasurements.packedBytes > budgets.package.maximumPackedBytes) {
    failures.push(
      `package: ${packageMeasurements.packedBytes} packed bytes exceeds ${budgets.package.maximumPackedBytes}-byte budget`,
    );
  }
  if (
    packageMeasurements.unpackedBytes > budgets.package.maximumUnpackedBytes
  ) {
    failures.push(
      `package: ${packageMeasurements.unpackedBytes} unpacked bytes exceeds ${budgets.package.maximumUnpackedBytes}-byte budget`,
    );
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Performance budgets passed:\n${measurements.join("\n")}`);
