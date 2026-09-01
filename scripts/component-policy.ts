export type CatalogEntryKind = "component" | "element";

export interface CatalogEntryPolicy {
  readonly kind: CatalogEntryKind;
  readonly rationale: string;
}

export const componentPolicy = {
  accordion: {
    kind: "component",
    rationale:
      "Coordinates disclosure state, focus, and composite keyboard navigation.",
  },
  alert: {
    kind: "element",
    rationale:
      "Authored alert semantics and CSS provide the complete contract.",
  },
  "alert-dialog": {
    kind: "component",
    rationale:
      "Coordinates modal disclosure, focus containment, and restoration.",
  },
  "aspect-ratio": {
    kind: "element",
    rationale: "CSS aspect-ratio provides the complete layout behavior.",
  },
  avatar: {
    kind: "component",
    rationale:
      "Coordinates asynchronous image loading and fallback visibility.",
  },
  badge: {
    kind: "element",
    rationale:
      "A badge is a styled inline HTML pattern with authored variants.",
  },
  breadcrumb: {
    kind: "element",
    rationale:
      "Native navigation, lists, links, and authored aria-current are sufficient.",
  },
  button: {
    kind: "element",
    rationale: "Native buttons and links own semantics, state, and activation.",
  },
  "button-group": {
    kind: "element",
    rationale:
      "Authored group semantics and CSS provide the complete contract.",
  },
  calendar: {
    kind: "component",
    rationale:
      "Coordinates generated date grids, selection, and grid keyboard navigation.",
  },
  card: {
    kind: "element",
    rationale:
      "A card is a styled semantic HTML composition without runtime behavior.",
  },
  carousel: {
    kind: "component",
    rationale:
      "Coordinates scrolling, drag gestures, snapping, controls, and autoplay.",
  },
  chart: {
    kind: "element",
    rationale:
      "Authored chart markup, semantics, and CSS variables provide the contract.",
  },
  checkbox: {
    kind: "element",
    rationale:
      "Native checkbox state and CSS pseudo-classes provide the complete contract.",
  },
  collapsible: {
    kind: "component",
    rationale:
      "Coordinates disclosure for native details and composed trigger-panel layouts.",
  },
  combobox: {
    kind: "component",
    rationale:
      "Coordinates popup disclosure, active descendants, filtering navigation, and selection signals.",
  },
  command: {
    kind: "component",
    rationale:
      "Coordinates active-item navigation and command activation across dynamic results.",
  },
  "context-menu": {
    kind: "component",
    rationale:
      "Coordinates context disclosure, placement, nested focus, and keyboard navigation.",
  },
  dialog: {
    kind: "component",
    rationale:
      "Coordinates triggers, modal disclosure, focus containment, and restoration.",
  },
  direction: {
    kind: "element",
    rationale:
      "The native dir attribute and CSS logical properties provide the contract.",
  },
  drawer: {
    kind: "component",
    rationale:
      "Coordinates modal disclosure and focus for edge-anchored content.",
  },
  dropdown: {
    kind: "component",
    rationale:
      "Coordinates menu disclosure, focus movement, submenus, and dismissal.",
  },
  empty: {
    kind: "element",
    rationale:
      "An empty state is styled authored content with optional native status semantics.",
  },
  field: {
    kind: "component",
    rationale:
      "Maintains dynamic accessible relationships between controls and validation messages.",
  },
  "hover-card": {
    kind: "component",
    rationale:
      "Coordinates delayed pointer and focus disclosure across trigger and content.",
  },
  input: {
    kind: "element",
    rationale:
      "Native input behavior, validation, and AngularTS models provide the contract.",
  },
  "input-group": {
    kind: "component",
    rationale:
      "Maintains dynamic accessible addon relationships and composite focus behavior.",
  },
  "input-otp": {
    kind: "component",
    rationale:
      "Coordinates multi-slot input, focus movement, deletion, and paste distribution.",
  },
  item: {
    kind: "element",
    rationale:
      "An item is a styled semantic HTML composition with authored state.",
  },
  kbd: {
    kind: "element",
    rationale:
      "The native kbd element already provides the required semantics.",
  },
  label: {
    kind: "element",
    rationale:
      "Native label association and form state provide the complete contract.",
  },
  menubar: {
    kind: "component",
    rationale:
      "Coordinates roving focus, nested menus, and direction-aware keyboard navigation.",
  },
  "native-select": {
    kind: "element",
    rationale:
      "Native select behavior, validation, and AngularTS models provide the contract.",
  },
  "navigation-menu": {
    kind: "component",
    rationale:
      "Coordinates navigation disclosure, focus movement, placement, and dismissal.",
  },
  pagination: {
    kind: "element",
    rationale:
      "Native navigation, lists, links, and authored current state are sufficient.",
  },
  popover: {
    kind: "component",
    rationale:
      "Coordinates trigger disclosure, focus, collision-aware placement, and dismissal.",
  },
  progress: {
    kind: "element",
    rationale:
      "Native progress or authored progressbar semantics and CSS variables are sufficient.",
  },
  "radio-group": {
    kind: "element",
    rationale:
      "Native radio groups own selection, keyboard behavior, and validation.",
  },
  resizable: {
    kind: "component",
    rationale:
      "Coordinates pointer and keyboard resizing with panel constraints.",
  },
  "scroll-area": {
    kind: "component",
    rationale:
      "Coordinates custom scrollbars, viewport geometry, and scroll state.",
  },
  select: {
    kind: "component",
    rationale:
      "Coordinates a custom listbox popup, option focus, typeahead, and selection signals.",
  },
  separator: {
    kind: "element",
    rationale:
      "Native hr or authored separator semantics and CSS are sufficient.",
  },
  sheet: {
    kind: "component",
    rationale:
      "Coordinates modal disclosure and focus for edge-anchored content.",
  },
  sidebar: {
    kind: "component",
    rationale:
      "Coordinates responsive disclosure, collapse modes, focus, and keyboard shortcuts.",
  },
  skeleton: {
    kind: "element",
    rationale:
      "A skeleton is a styled placeholder with authored accessibility semantics.",
  },
  slider: {
    kind: "component",
    rationale:
      "Coordinates composite multi-thumb geometry while preserving native range inputs.",
  },
  sonner: {
    kind: "component",
    rationale:
      "Coordinates live toast insertion, timing, dismissal, and placement.",
  },
  spinner: {
    kind: "element",
    rationale:
      "A spinner is styled status content with authored accessibility semantics.",
  },
  switch: {
    kind: "element",
    rationale:
      "A native checkbox and AngularTS model own the complete behavior without a component directive.",
  },
  table: {
    kind: "element",
    rationale:
      "Native table structure and authored header scopes provide the contract.",
  },
  tabs: {
    kind: "component",
    rationale:
      "Coordinates roving focus, selection, panels, orientation, and direction.",
  },
  textarea: {
    kind: "element",
    rationale:
      "Native textarea behavior, validation, and AngularTS models provide the contract.",
  },
  toggle: {
    kind: "element",
    rationale:
      "A native button with authored aria-pressed and AngularTS state is sufficient.",
  },
  "toggle-group": {
    kind: "component",
    rationale:
      "Coordinates roving focus and single or multiple selection across toggles.",
  },
  tooltip: {
    kind: "component",
    rationale:
      "Coordinates delayed hover and focus disclosure, placement, and dismissal.",
  },
} as const satisfies Record<string, CatalogEntryPolicy>;

export type CatalogEntryName = keyof typeof componentPolicy;

export const elementNames = Object.entries(componentPolicy)
  .filter(([, policy]) => policy.kind === "element")
  .map(([name]) => name)
  .sort();

export const componentNames = Object.entries(componentPolicy)
  .filter(([, policy]) => policy.kind === "component")
  .map(([name]) => name)
  .sort();
