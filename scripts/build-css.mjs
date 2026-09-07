import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import browserslist from "browserslist";
import { watch } from "chokidar";
import { browserslistToTargets, bundleAsync } from "lightningcss";

const repository = resolve(fileURLToPath(new URL("..", import.meta.url)));
const watchMode = process.argv.includes("--watch");
const targets = browserslistToTargets(browserslist());
const terrazzoCli = resolve(
  repository,
  "node_modules/@terrazzo/cli/bin/cli.js",
);

await build();

if (watchMode) {
  const watcher = watch(
    ["src/**/*.css", "tokens/**/*.json", "terrazzo.config.js"],
    {
      cwd: repository,
      ignoreInitial: true,
      ignored: ["src/styles/generated/tokens.css"],
    },
  );
  let queued = false;

  watcher.on("all", (_event, filename) => {
    if (queued) return;
    queued = true;
    setTimeout(async () => {
      queued = false;
      try {
        await build();
      } catch (error) {
        console.error(error);
      }
    }, 50);
  });

  console.log("Watching CSS and customization token sources…");
}

async function build() {
  buildTokens();

  const angularCss = await compile("src/index.css", !watchMode);
  const preflightCss = await compile("src/preflight.css", !watchMode);

  write("dist/angular.css", angularCss);
  write("docs/assets/angular.css", angularCss);
  write("docs/static/css/angular.css", angularCss);
  write("docs/static/css/preflight.css", preflightCss);

  const tailwindMarkers = angularCss.match(
    /(?:@apply|@theme|@custom-variant|--tw-)/g,
  );
  if (tailwindMarkers) {
    throw new Error(
      `Compiled AngularCSS contains Tailwind implementation markers: ${[
        ...new Set(tailwindMarkers),
      ].join(", ")}`,
    );
  }

  console.log(
    `Built AngularCSS (${angularCss.length} bytes) and documentation preflight (${preflightCss.length} bytes).`,
  );
}

function buildTokens() {
  const result = spawnSync(
    process.execPath,
    [terrazzoCli, "build", "--config", "terrazzo.config.js", "--silent"],
    { cwd: repository, encoding: "utf8" },
  );

  if (result.status !== 0) {
    process.stderr.write(result.stdout);
    process.stderr.write(result.stderr);
    throw new Error(`Terrazzo exited with status ${result.status}`);
  }
}

async function compile(filename, minify) {
  const result = await bundleAsync({
    filename: resolve(repository, filename),
    minify,
    sourceMap: false,
    targets,
  });

  for (const warning of result.warnings) console.warn(warning.message);
  return result.code.toString();
}

function write(filename, contents) {
  const output = resolve(repository, filename);
  mkdirSync(dirname(output), { recursive: true });

  if (
    readFileSync(output, { encoding: "utf8", flag: "a+" }) ===
    contents.toString()
  ) {
    return;
  }

  writeFileSync(output, contents);
}
