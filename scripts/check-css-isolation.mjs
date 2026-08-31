import { readFileSync } from "node:fs";

const cssFiles = ["dist/angular.css", "docs/assets/angular.css"];

const bootstrapClassNames = [
  "accordion",
  "alert",
  "badge",
  "breadcrumb",
  "btn",
  "card",
  "carousel",
  "collapse",
  "container",
  "dropdown",
  "form-check",
  "form-control",
  "form-select",
  "input-group",
  "list-group",
  "modal",
  "nav",
  "navbar",
  "offcanvas",
  "pagination",
  "popover",
  "progress",
  "row",
  "show",
  "toast",
  "tooltip",
];

const broadSelectorPatterns = [
  /(^|,)\s*button(?!\[ng-button\]|\[data-slot=button\]|\[ng-switch-control\])/,
  /(^|,)\s*input(?!\[.*(?:data-input|ng-checkbox|ng-radio-group-item|ng-slider|ng-switch-control|data-slot=))/,
  /(^|,)\s*label(?!\[ng-label\]|\[data-slot=label\]|\[data-slot=field-label\])/,
  /(^|,)\s*select(?!\[ng-native-select\]|\[data-slot=native-select\])/,
  /(^|,)\s*textarea(?!\[ng-textarea\]|\[data-slot=textarea\])/,
  /(^|,)\s*(?:html|body|ol|ul|menu|img|svg|video|canvas|audio|iframe|object)\b/,
];

const classPattern = new RegExp(
  `\\.(${bootstrapClassNames.join("|")})(?=[\\s.#:[>{,+~]|$)`,
);

const extractSelectorBlocks = (css) =>
  css
    .split("{")
    .slice(0, -1)
    .map((chunk) => chunk.slice(chunk.lastIndexOf("}") + 1).trim())
    .filter((selector) => selector && !selector.startsWith("@"));

const failures = [];

for (const file of cssFiles) {
  const css = readFileSync(file, "utf8");
  const selectors = extractSelectorBlocks(css);

  for (const selector of selectors) {
    const classMatch = selector.match(classPattern);
    if (classMatch) {
      failures.push(`${file}: Bootstrap class selector ".${classMatch[1]}" in "${selector}"`);
    }

    for (const pattern of broadSelectorPatterns) {
      if (pattern.test(selector)) {
        failures.push(`${file}: broad element selector "${selector}"`);
      }
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("CSS isolation check passed.");
