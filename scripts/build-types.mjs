import { spawnSync } from "node:child_process";
import { rmSync } from "node:fs";
import { join } from "node:path";

rmSync("@types", { force: true, recursive: true });

const tsc = join(
  "node_modules",
  ".bin",
  process.platform === "win32" ? "tsc.cmd" : "tsc",
);

const result = spawnSync(tsc, ["--project", "tsconfig.types.json"], {
  stdio: "inherit",
});

process.exit(result.status ?? 1);
