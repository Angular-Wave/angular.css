import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const listFiles = (directory) =>
  readdirSync(directory)
    .flatMap((entry) => {
      const path = join(directory, entry);
      return statSync(path).isDirectory() ? listFiles(path) : path;
    });

const forbiddenFiles = listFiles("src").filter((path) =>
  /\.(?:js|jsx)$/.test(path),
);

if (forbiddenFiles.length > 0) {
  console.error(
    [
      "Source behavior must be implemented in TypeScript.",
      ...forbiddenFiles.map((file) => `- ${file}`),
    ].join("\n"),
  );
  process.exit(1);
}

console.log("TypeScript source check passed.");
