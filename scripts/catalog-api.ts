import type { CatalogEntryName } from "./component-policy.ts";

export interface CatalogReferenceApi {
  readonly attributes?: readonly string[];
  readonly attributeDescriptions?: Readonly<Record<string, string>>;
  readonly cssVariables?: Readonly<Record<string, string>>;
  readonly rootSelector?: string;
}

/** Public authored styling hooks that cannot be derived from runtime code. */
export const catalogReferenceApi: Partial<
  Record<CatalogEntryName, CatalogReferenceApi>
> = {
  direction: {
    attributes: ["align", "dir"],
  },
  button: {
    attributes: [
      "aria-disabled",
      "aria-haspopup",
      "aria-invalid",
      "icon",
      "size",
      "variant",
    ],
    attributeDescriptions: {
      icon: "Icon position: `inline-start` or `inline-end`.",
      size: "Size: `xs`, `sm`, `default`, `lg`, `icon-xs`, `icon-sm`, `icon`, or `icon-lg`.",
      variant:
        "Style: `default`, `secondary`, `outline`, `ghost`, `link`, `destructive`, `info`, `success`, `warning`, or `error`.",
    },
  },
  checkbox: { attributes: ["checked", "disabled", "required"] },
  dialog: { attributes: ["command", "commandfor", "closedby", "dir", "size"] },
  input: { attributes: ["aria-invalid", "disabled", "type"] },
  label: { attributes: ["for"], rootSelector: "label" },
  progress: { attributes: ["dir", "max", "value"] },
  "radio-group": {
    attributes: [
      "aria-invalid",
      "checked",
      "dir",
      "disabled",
      "name",
      "required",
      "value",
    ],
  },
  range: {
    attributes: ["disabled", "max", "min", "orientation", "step", "value"],
    rootSelector: 'input[type="range"]',
  },
  "scroll-area": { attributes: ["dir", "tabindex"] },
  select: {
    attributes: [
      "aria-invalid",
      "dir",
      "disabled",
      "multiple",
      "name",
      "required",
      "size",
    ],
    rootSelector: "select",
  },
  separator: { attributes: ["aria-orientation"] },
  switch: { attributes: ["checked", "disabled", "required", "size"] },
  table: { attributes: ["aria-selected"] },
  textarea: { attributes: ["aria-invalid", "disabled", "required"] },

  accordion: { attributes: ["inert", "name", "open"] },
  alert: { attributes: ["variant"] },
  "aspect-ratio": {
    attributes: ["ratio"],
    attributeDescriptions: {
      ratio:
        "Aspect ratio: `1 / 1`, `9 / 16`, or `16 / 9`; defaults to `16 / 9`.",
    },
    cssVariables: {
      "--ratio": "Rendered aspect ratio; defaults to `16 / 9`.",
    },
  },
  avatar: { attributes: ["size", "variant"] },
  badge: { attributes: ["icon", "variant"] },
  breadcrumb: { attributes: ["aria-current", "dir"] },
  "button-group": { attributes: ["aria-orientation", "orientation"] },
  card: {
    attributes: ["size"],
    attributeDescriptions: {
      size: "Use `sm` for compact spacing; omit for the default size.",
    },
    cssVariables: {
      "--card-padding-block":
        "Block padding; defaults to four spacing units, or three for `size=sm`.",
    },
  },
  chart: {
    attributes: ["data-color", "data-value", "indicator"],
    cssVariables: {
      "--chart-color":
        "Color for an authored series, mark, or legend indicator.",
      "--value":
        "Bar height as a percentage; falls back to `data-value` and then `50%`.",
    },
  },
  "description-list": {
    attributes: ["orientation"],
    rootSelector: "dl.description-list",
  },
  disclosure: { attributes: ["open"] },
  empty: { attributes: ["variant"] },
  field: { attributes: ["aria-invalid", "orientation", "variant"] },
  "file-upload": { attributes: ["accept", "dragging", "multiple"] },
  "filter-bar": { rootSelector: "form.filter-bar" },
  "input-group": { attributes: ["align", "aria-invalid", "border", "size"] },
  "input-otp": {
    attributes: ["aria-invalid", "maxlength", "pattern", "size"],
    cssVariables: {
      "--otp-cell-size":
        "Width of one visual code cell; defaults to ten spacing units.",
    },
  },
  item: { attributes: ["size", "variant"] },
  pagination: { attributes: ["aria-current", "aria-disabled", "dir"] },
  popover: { attributes: ["align", "popover", "popovertarget", "side"] },
  spinner: { attributes: ["size"] },
  stepper: { attributes: ["aria-current"], rootSelector: "nav.stepper" },
  toggle: { attributes: ["aria-disabled", "aria-pressed", "size", "variant"] },
  "toggle-group": {
    attributes: ["orientation", "size", "spacing", "variant"],
    cssVariables: {
      "--toggle-group-gap": "Gap between controls; defaults to `0`.",
    },
  },
  "validation-summary": { attributes: ["aria-live", "tabindex"] },

  calendar: {
    attributes: [
      "data-booked-dates",
      "data-calendar-preset",
      "data-caption-layout",
      "data-disabled-after",
      "data-disabled-before",
      "data-disabled-dates",
      "data-end-year",
      "data-min-nights",
      "data-month",
      "data-number-of-months",
      "data-selection-mode",
      "data-show-outside-days",
      "data-show-week-numbers",
      "data-start-year",
      "data-value",
      "data-values",
      "data-week-start",
    ],
    attributeDescriptions: {
      "data-booked-dates": "Comma-separated ISO dates styled as booked.",
      "data-calendar-preset":
        "Generated calendar preset: `single`, `multiple`, or `range`.",
      "data-caption-layout": "Caption controls: `label` or `dropdown`.",
      "data-disabled-after": "Last selectable date as an ISO date.",
      "data-disabled-before": "First selectable date as an ISO date.",
      "data-disabled-dates":
        "Comma-separated ISO dates that cannot be selected.",
      "data-end-year": "Final year offered by a dropdown caption.",
      "data-min-nights":
        "Minimum number of nights accepted by range selection.",
      "data-month": "Displayed month in `YYYY-MM` form.",
      "data-number-of-months": "Number of consecutive months to render.",
      "data-selection-mode":
        "Selection behavior: `single`, `multiple`, or `range`.",
      "data-show-outside-days": "Shows dates from adjacent months when `true`.",
      "data-show-week-numbers": "Shows ISO-style week numbers when `true`.",
      "data-start-year": "First year offered by a dropdown caption.",
      "data-value": "Selected ISO date for single selection.",
      "data-values":
        "Comma-separated selected ISO dates for multiple selection.",
      "data-week-start":
        "First weekday as an integer from `0` (Sunday) to `6` (Saturday).",
    },
    cssVariables: {
      "--calendar-cell-size":
        "Width and height of calendar controls and day cells.",
    },
  },
  combobox: {
    attributes: ["auto-highlight", "multiple", "open"],
    attributeDescriptions: {
      "auto-highlight":
        "Highlights the first enabled result when the popup opens or filters change.",
      multiple:
        "Keeps the popup open and reports selections for an application-owned collection.",
      open: "Initial or externally synchronized disclosure state.",
    },
  },
  "context-menu": {
    attributes: ["align-offset", "side-offset"],
    attributeDescriptions: {
      "align-offset": "Additional alignment offset in CSS pixels.",
      "side-offset": "Distance from the invocation point in CSS pixels.",
    },
  },
  "dropdown-menu": {
    attributes: ["align-offset", "side-offset"],
    attributeDescriptions: {
      "align-offset": "Additional alignment offset in CSS pixels.",
      "side-offset": "Distance from the trigger in CSS pixels.",
    },
  },
  carousel: {
    cssVariables: {
      "--carousel-gap": "Gap between slides; defaults to four spacing units.",
      "--carousel-item-size": "Slide basis; defaults to `100%`.",
    },
  },
  resizable: {
    attributes: ["data-max-size", "data-min-size", "data-step", "orientation"],
    attributeDescriptions: {
      "data-max-size": "Largest panel flex size allowed during resizing.",
      "data-min-size": "Smallest panel flex size allowed during resizing.",
      "data-step": "Panel flex-size increment used by keyboard resizing.",
      orientation: "Resize axis: `horizontal` or `vertical`.",
    },
  },
  sidebar: {
    attributes: ["collapsed", "collapsible", "responsive", "side", "variant"],
    attributeDescriptions: {
      collapsed: "Current collapsed state.",
      collapsible: "Collapse behavior: `offcanvas`, `icon`, or `none`.",
      responsive:
        "Collapses an off-canvas sidebar below `48rem` and expands it above that breakpoint.",
      side: "Physical placement: `left` or `right`.",
      variant: "Surface style: `sidebar`, `floating`, or `inset`.",
    },
  },
  toolbar: { attributes: ["aria-label", "orientation"] },
  tree: {
    attributes: ["aria-label", "aria-multiselectable", "data-value"],
    attributeDescriptions: {
      "aria-multiselectable":
        "Set to `true` to allow Ctrl or Command click selection of several items.",
      "data-value": "Application value included in `angularcss:tree-select`.",
    },
  },
  "application-shell": {},
  "data-table": {
    attributes: ["aria-selected", "aria-sort"],
    cssVariables: {
      "--data-table-max-height":
        "Maximum scrollable table height; defaults to `32rem`.",
    },
  },
  "date-picker": { attributes: ["aria-invalid"] },
  "form-layout": {
    attributes: ["columns"],
    attributeDescriptions: {
      columns: "Preferred desktop column count: `1`, `2`, or `3`.",
    },
    rootSelector: "form.form-layout",
  },
  "master-detail": { attributes: ["orientation"] },
  "alert-dialog": { attributes: ["size"] },
  drawer: { attributes: ["dir", "side", "size"] },
  sheet: { attributes: ["command", "dir", "side", "size"] },
};
