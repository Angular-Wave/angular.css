/** @type {import("stylelint").Config} */
export default {
  extends: ["stylelint-config-standard"],
  ignoreFiles: [
    "dist/**",
    "docs/assets/angular.css",
    "docs/static/css/angular.css",
    "docs/static/css/docsy.css",
    "docs/static/css/preflight.css",
    "docs/static/examples/applications/**/*.css",
    "src/styles/generated/**",
    "public/**",
    "ui/**",
  ],
  defaultSeverity: "error",
  reportDescriptionlessDisables: true,
  reportInvalidScopeDisables: true,
  reportNeedlessDisables: true,
  overrides: [
    {
      files: ["docs/static/examples/example.css"],
      rules: {
        // Independent component fixtures share this file, so terminal selectors
        // can look related even though their ancestor scopes never intersect.
        "no-descending-specificity": null,
      },
    },
  ],
  rules: {
    "at-rule-no-unknown": true,
    "at-rule-prelude-no-invalid": [true, { ignoreAtRules: ["import"] }],
    "declaration-no-important": true,
    "import-notation": "string",
    "max-nesting-depth": 3,
    "selector-max-id": 0,
  },
};
