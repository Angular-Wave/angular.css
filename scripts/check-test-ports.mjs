import { readFileSync } from "node:fs";

const blockedPorts = new Set(["3000", "4000"]);
const files = ["package.json", "playwright.config.ts"];
const failures = [];

for (const file of files) {
  const source = readFileSync(file, "utf8");

  for (const port of blockedPorts) {
    const portPattern = new RegExp(`(?:localhost|127\\.0\\.0\\.1|--port)[:= ]+${port}\\b`);

    if (portPattern.test(source)) {
      failures.push(`${file}: test/dev tooling must not use blocked port ${port}`);
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Test port check passed.");
