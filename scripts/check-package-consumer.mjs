import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const requestedTarball = process.argv[2];
if (!requestedTarball) {
  throw new Error("Usage: node scripts/check-package-consumer.mjs <tarball>");
}

const repository = resolve(fileURLToPath(new URL("..", import.meta.url)));
const tarball = isAbsolute(requestedTarball)
  ? requestedTarball
  : resolve(requestedTarball);
const consumer = mkdtempSync(join(tmpdir(), "angularcss-consumer-"));

try {
  writeFileSync(
    join(consumer, "package.json"),
    `${JSON.stringify({ name: "angularcss-release-consumer", private: true, type: "module" }, null, 2)}\n`,
  );
  run("npm", [
    "install",
    tarball,
    "--ignore-scripts",
    "--no-audit",
    "--no-fund",
  ]);

  run(process.execPath, [
    "--input-type=module",
    "--eval",
    `
      const packageModule = await import("@angular-wave/angular.css");
      if (packageModule.angularCssModuleName !== "angular.css") {
        throw new Error("Unexpected AngularCSS module name");
      }
      const css = import.meta.resolve("@angular-wave/angular.css/angular.css");
      if (!css.endsWith("/dist/angular.css")) {
        throw new Error(\`Unexpected CSS export: \${css}\`);
      }
    `,
  ]);

  writeFileSync(
    join(consumer, "consumer.ts"),
    `import {
  angularCssModuleName,
  registerAngularCss,
  type AngularCssCustomEvent,
} from "@angular-wave/angular.css";

const event: AngularCssCustomEvent<"angularcss:combobox-select"> | undefined =
  undefined;
void [angularCssModuleName, registerAngularCss, event];
`,
  );
  writeFileSync(
    join(consumer, "tsconfig.json"),
    `${JSON.stringify(
      {
        compilerOptions: {
          lib: ["DOM", "ES2023"],
          module: "NodeNext",
          moduleResolution: "NodeNext",
          noEmit: true,
          strict: true,
          target: "ES2023",
        },
        files: ["consumer.ts"],
      },
      null,
      2,
    )}\n`,
  );
  run(join(repository, "node_modules", ".bin", "tsc"), ["-p", "tsconfig.json"]);

  const installed = JSON.parse(
    readFileSync(
      join(
        consumer,
        "node_modules",
        "@angular-wave",
        "angular.css",
        "package.json",
      ),
      "utf8",
    ),
  );
  console.log(
    `Clean consumer accepted ${installed.name}@${installed.version}, its ESM and CSS exports, and its declarations.`,
  );
} finally {
  rmSync(consumer, { force: true, recursive: true });
}

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: consumer,
    encoding: "utf8",
    stdio: "pipe",
  });
  if (result.status !== 0) {
    process.stderr.write(result.stdout);
    process.stderr.write(result.stderr);
    throw new Error(`${command} exited with status ${result.status}`);
  }
}
