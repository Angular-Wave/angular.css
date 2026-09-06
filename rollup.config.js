import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import versionInjector from "rollup-plugin-version-injector";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkg = JSON.parse(
  readFileSync(path.resolve(__dirname, "package.json"), "utf-8"),
);

const basePlugins = [
  resolve({ extensions: [".mjs", ".js", ".json", ".node", ".ts"] }),
  commonjs(),
  typescript({
    declaration: false,
    declarationMap: false,
    noEmit: false,
    sourceMap: false,
    tsconfig: "./tsconfig.rollup.json",
  }),
  versionInjector({
    injectInComments: {
      tag: "Version: {version}",
    },
  }),
];

const baseInput = "src/index.ts";

const applicationPlugins = [
  resolve({ extensions: [".mjs", ".js", ".json", ".node", ".ts"] }),
  commonjs(),
  typescript({
    declaration: false,
    declarationMap: false,
    noEmit: false,
    sourceMap: false,
    tsconfig: "./tsconfig.rollup.json",
  }),
];

export default [
  // UMD build - minified and unminified
  {
    input: baseInput,
    output: [
      {
        name: "angularCss",
        file: pkg.browser.replace(/\.js$/, ".min.js"),
        format: "umd",
        plugins: [
          terser({
            compress: {
              passes: 3,
              keep_fnames: false,
            },
            mangle: {
              toplevel: true,
              properties: {
                regex: /^_/,
                keep_quoted: false,
              },
            },
          }),
        ],
      },
      {
        name: "angularCss",
        file: pkg.browser,
        format: "umd",
      },
    ],
    plugins: basePlugins,
  },

  // ESM build
  {
    input: baseInput,
    external: ["ms"],
    output: [
      {
        file: pkg.module,
        format: "es",
      },
    ],
    plugins: [
      typescript({ tsconfig: "./tsconfig.rollup.json" }),
      versionInjector({
        injectInComments: {
          tag: "Version: {version}",
        },
      }),
    ],
  },

  {
    input: "examples/bookings/bookings.ts",
    output: {
      file: "examples/bookings/bookings.js",
      format: "iife",
      name: "bookingsDemo",
    },
    plugins: applicationPlugins,
  },
  {
    input: "examples/toast/toast.ts",
    output: {
      file: "docs/static/js/toast-demo.umd.js",
      format: "iife",
      name: "toastDemo",
    },
    plugins: applicationPlugins,
  },
  {
    input: "examples/progress/progress.ts",
    output: {
      file: "docs/static/js/progress-demo.umd.js",
      format: "iife",
      name: "progressDemo",
    },
    plugins: applicationPlugins,
  },
  {
    input: "examples/date-picker/date-picker.ts",
    output: {
      file: "docs/static/js/date-picker-demo.umd.js",
      format: "iife",
      name: "datePickerDemo",
    },
    plugins: applicationPlugins,
  },
  {
    input: "examples/command/command.ts",
    output: {
      file: "docs/static/js/command-demo.umd.js",
      format: "iife",
      name: "commandDemo",
    },
    plugins: applicationPlugins,
  },
];
