export type CatalogCategory =
  | "foundations"
  | "elements"
  | "patterns"
  | "components"
  | "recipes";

export interface CatalogEntryPolicy {
  readonly category: CatalogCategory;
  readonly runtime: boolean;
  readonly rationale: string;
}

const entry = (
  category: CatalogCategory,
  rationale: string,
  runtime = false,
): CatalogEntryPolicy => ({ category, rationale, runtime });

export const catalogPolicy = {
  direction: entry("foundations", "Native dir and CSS logical properties."),

  button: entry("elements", "Native button and link activation."),
  checkbox: entry("elements", "Native checkbox state and validation."),
  dialog: entry("elements", "Native dialog top-layer and modal behavior."),
  input: entry("elements", "Native input behavior and AngularTS models."),
  kbd: entry("elements", "Native keyboard-input semantics."),
  label: entry("elements", "Native form-control association."),
  progress: entry("elements", "Native progress semantics and state."),
  "radio-group": entry("elements", "Native fieldset and radio behavior."),
  range: entry("elements", "Native range input behavior and styling."),
  "scroll-area": entry("elements", "Native overflow and scrolling."),
  select: entry("elements", "Native select, option, and optgroup behavior."),
  separator: entry("elements", "Native horizontal-rule semantics."),
  switch: entry("elements", "Native checkbox state with switch presentation."),
  table: entry("elements", "Native tabular structure and header scopes."),
  textarea: entry("elements", "Native textarea behavior and AngularTS models."),

  accordion: entry("patterns", "Named native details disclosures."),
  alert: entry("patterns", "Semantic authored status content."),
  "aspect-ratio": entry("patterns", "CSS aspect-ratio layout."),
  avatar: entry("patterns", "Native image and fallback composition."),
  badge: entry("patterns", "Styled inline authored content."),
  breadcrumb: entry("patterns", "Native navigation and list composition."),
  "button-group": entry("patterns", "Grouped native actions."),
  card: entry("patterns", "Semantic content composition."),
  chart: entry("patterns", "Authored figures, tables, and CSS variables."),
  "description-list": entry(
    "patterns",
    "Native description-list structure for record details.",
  ),
  disclosure: entry("patterns", "Native details and summary disclosure."),
  empty: entry("patterns", "Semantic empty-state content."),
  field: entry("patterns", "Native labels, descriptions, and validation."),
  "file-upload": entry("patterns", "Native file input and authored status."),
  "filter-bar": entry("patterns", "Semantic search and filter form."),
  "input-group": entry("patterns", "Grouped native controls and addons."),
  "input-otp": entry("patterns", "One native one-time-code input."),
  item: entry("patterns", "Semantic repeated-content composition."),
  pagination: entry("patterns", "Native navigation, lists, and links."),
  popover: entry("patterns", "Native Popover API disclosure."),
  skeleton: entry("patterns", "Authored loading placeholder."),
  spinner: entry("patterns", "Authored status indicator."),
  stepper: entry("patterns", "Native ordered workflow navigation."),
  toggle: entry("patterns", "Native button pressed state."),
  "toggle-group": entry("patterns", "Native radio or checkbox grouping."),
  "validation-summary": entry(
    "patterns",
    "Authored validation messages linked to form controls.",
  ),

  calendar: entry("components", "Generated date grids and selection.", true),
  carousel: entry("components", "Scrolling, snapping, and controls.", true),
  combobox: entry("components", "Popup filtering and active options.", true),
  command: entry("components", "Dynamic command navigation.", true),
  "context-menu": entry(
    "components",
    "Context placement and nested menus.",
    true,
  ),
  "dropdown-menu": entry(
    "components",
    "Menu disclosure and focus movement.",
    true,
  ),
  "hover-card": entry(
    "components",
    "Delayed pointer and focus disclosure.",
    true,
  ),
  menubar: entry("components", "Roving focus and nested menus.", true),
  "navigation-menu": entry(
    "components",
    "Navigation disclosure and focus.",
    true,
  ),
  "range-slider": entry(
    "components",
    "Composite multi-thumb range geometry.",
    true,
  ),
  resizable: entry("components", "Pointer and keyboard panel resizing.", true),
  sidebar: entry("components", "Responsive collapse and focus state.", true),
  tabs: entry("components", "Roving focus and panel selection.", true),
  toast: entry("components", "Live insertion, timing, and dismissal.", true),
  toolbar: entry("components", "Roving focus across grouped actions.", true),
  tooltip: entry("components", "Hover and focus description disclosure.", true),
  tree: entry(
    "components",
    "Hierarchical focus, expansion, and selection.",
    true,
  ),

  "alert-dialog": entry("recipes", "A native dialog configured for decisions."),
  "application-shell": entry(
    "recipes",
    "Application header, navigation, and workspace composition.",
  ),
  "data-table": entry(
    "recipes",
    "Semantic table with application-owned data operations.",
  ),
  "date-picker": entry(
    "recipes",
    "Calendar, popover, and form-control composition.",
  ),
  drawer: entry("recipes", "A native dialog placed at a viewport edge."),
  "form-layout": entry(
    "recipes",
    "Responsive native form and field composition.",
  ),
  "master-detail": entry(
    "recipes",
    "Responsive record list and detail workspace.",
  ),
  sheet: entry("recipes", "A native dialog presented as a side sheet."),
} as const satisfies Record<string, CatalogEntryPolicy>;

export type CatalogEntryName = keyof typeof catalogPolicy;

export const catalogCategories: readonly CatalogCategory[] = [
  "foundations",
  "elements",
  "patterns",
  "components",
  "recipes",
];

export const catalogNames = Object.keys(
  catalogPolicy,
).sort() as CatalogEntryName[];

export const namesInCategory = (
  category: CatalogCategory,
): CatalogEntryName[] =>
  catalogNames.filter((name) => catalogPolicy[name].category === category);
