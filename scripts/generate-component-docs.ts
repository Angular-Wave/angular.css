import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join, resolve } from "node:path";

import { componentPolicy } from "./component-policy.ts";

const START = "<!-- angularcss-reference:start -->";
const END = "<!-- angularcss-reference:end -->";
const ELEMENT_START = "<!-- angularcss-element-reference:start -->";
const ELEMENT_END = "<!-- angularcss-element-reference:end -->";
const checkOnly = process.argv.includes("--check");

const unique = (values: Iterable<string>): string[] =>
  [...new Set(values)].sort((left, right) => left.localeCompare(right));

const matches = (source: string, expression: RegExp): string[] =>
  unique([...source.matchAll(expression)].map((match) => match[1]));

const readStyles = (path: string, visited = new Set<string>()): string => {
  const absolutePath = resolve(path);
  if (visited.has(absolutePath)) return "";
  visited.add(absolutePath);

  const source = readFileSync(absolutePath, "utf8");
  const imports = [...source.matchAll(/@import\s+["']([^"']+\.css)["']/g)]
    .map((match) => resolve(dirname(absolutePath), match[1]))
    .filter(existsSync)
    .map((importPath) => readStyles(importPath, visited));

  return [source, ...imports].join("\n");
};

const componentNames = readdirSync("src/components")
  .filter((entry) => statSync(join("src/components", entry)).isDirectory())
  .filter((entry) => existsSync(join("src/components", entry, `${entry}.ts`)))
  .sort();

const indexSource = readFileSync("src/index.ts", "utf8");
const directiveBySymbol = new Map<string, string>(
  [...indexSource.matchAll(/\["([^"]+)",\s*([A-Za-z0-9]+)\]/g)].map(
    ([, directive, symbol]) => [symbol, directive],
  ),
);
const directiveByComponent = new Map<string, string>();

for (const [, symbol, component] of indexSource.matchAll(
  /import \{ ([A-Za-z0-9]+) \} from "\.\/components\/([^/]+)\//g,
)) {
  const directive = directiveBySymbol.get(symbol);
  if (directive) directiveByComponent.set(component, directive);
}

const toSelector = (directive: string): string =>
  directive.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

const componentsByCategory: Record<string, readonly string[]> = {
  action: ["button", "button-group", "toggle", "toggle-group"],
  "command palette": ["command"],
  "data display": ["chart", "table"],
  "date input": ["calendar"],
  disclosure: ["accordion", "collapsible"],
  feedback: ["alert", "badge", "progress", "skeleton", "sonner", "spinner"],
  form: [
    "checkbox",
    "field",
    "input",
    "input-group",
    "input-otp",
    "label",
    "native-select",
    "select",
    "radio-group",
    "slider",
    "switch",
    "textarea",
  ],
  "form overlay": ["combobox"],
  layout: [
    "aspect-ratio",
    "card",
    "empty",
    "item",
    "resizable",
    "scroll-area",
    "separator",
  ],
  media: ["avatar", "carousel"],
  menu: ["context-menu", "dropdown", "menubar"],
  navigation: [
    "breadcrumb",
    "navigation-menu",
    "pagination",
    "sidebar",
    "tabs",
  ],
  overlay: [
    "alert-dialog",
    "dialog",
    "drawer",
    "hover-card",
    "popover",
    "sheet",
    "tooltip",
  ],
  text: ["kbd"],
  utility: ["direction"],
};
const categoryByComponent = new Map(
  Object.entries(componentsByCategory).flatMap(([category, components]) =>
    components.map((component) => [component, category] as const),
  ),
);
const uncategorizedComponents = componentNames.filter(
  (component) => !categoryByComponent.has(component),
);

if (uncategorizedComponents.length > 0) {
  throw new Error(
    `Missing documentation categories for: ${uncategorizedComponents.join(", ")}`,
  );
}

const behaviorByCategory: Record<string, string> = {
  action:
    "The directive mirrors interaction state for styling and supplies only the keyboard behavior required by the component contract. Application commands and business state remain in AngularTS expressions.",
  "command palette":
    "The directive manages active-item navigation across the visible command items. Filtering, command execution, result data, and dialog state remain application-owned AngularTS behavior.",
  "data display":
    "AngularCSS provides semantic structure and styling hooks. Data loading, formatting, sorting, visualization, and application state remain outside the component.",
  "date input":
    "The directive manages grid focus and selection signaling. Date arithmetic, localization, validation, range state, and form-model updates remain application concerns.",
  disclosure:
    "The directive owns disclosure keyboard and open-state synchronization. The content itself and any application state inside a panel remain ordinary HTML and AngularTS scope state.",
  feedback:
    "The directive exposes presentation and announcement state. The application decides when feedback appears, changes, or is removed.",
  form: "Native form state and AngularTS `ng-model`, validation, and submission remain the source of truth. AngularCSS mirrors that state into stable styling and accessibility hooks.",
  "form overlay":
    "The directive owns popup focus and keyboard navigation. Filtering, selected values, validation, and AngularTS model updates remain application state.",
  layout:
    "The component owns layout-specific DOM relationships and CSS state only. Content, persistence, routing, and application state remain with the application.",
  media:
    "The directive reflects media loading and fallback state. The application remains responsible for the source URL, alternative text, and content lifecycle.",
  menu: "The directive owns menu disclosure, focus movement, escape handling, and outside-click closure. Command execution and checked values remain application-owned.",
  navigation:
    "The directive supplies navigation semantics and keyboard state where required. URLs, routing, current-page state, and navigation side effects remain application-owned.",
  overlay:
    "The directive owns overlay disclosure, escape and outside-click closure, focus trapping where modal, and focus restoration. The application owns the content and the state that opens the overlay.",
  text: "This component is primarily semantic HTML with styling hooks and does not introduce application state.",
  utility:
    "The directive mirrors a platform-level value into stable styling hooks without creating a separate application model.",
};

const behaviorByComponent: Record<string, string> = {
  field:
    "Field is a styling-only semantic form composition. Native labels, validation, and `aria-describedby` own relationships; AngularTS forms and structural directives own model, error visibility, and submission state.",
  "input-group":
    "Input Group is styling-only. Native controls own focus, values, validation, and submission. Use a native `label` addon when clicking addon text should focus the control; AngularTS owns dynamic text and actions.",
  avatar:
    "Avatar is a styling-only authored HTML pattern. Native `img` loading and alternative text remain browser behavior; use a fallback-only avatar when no image is available, or AngularTS structural directives when application state chooses between sources.",
  "alert-dialog":
    "A native `dialog` opened with `command=show-modal` owns top-layer rendering, modal focus, Escape, background isolation, and trigger focus restoration. Use `closedby=closerequest` when pointer light-dismiss must be disabled. AngularCSS registers no alert-dialog directive.",
  accordion:
    "Native `details` and `summary` own disclosure, focus, and keyboard behavior. Give sibling details the same `name` for an exclusive accordion, or omit `name` when several panels may remain open. AngularCSS registers no accordion directive.",
  calendar:
    "The directive owns generated Gregorian month grids, local-date navigation, selectable day state, range and multiple-selection signaling, disabled and booked constraints, caption controls, week numbers, keyboard grid movement, and synchronized authored attributes. AngularTS remains responsible for application models, parsed text, commands, validation, and composed popover state. Natural-language and non-Gregorian conversion remain explicit application adapters; the packaged Date Picker demo uses locally bundled `chrono-node` without adding a second model implementation.",
  carousel:
    "The directive uses Embla to own drag gestures, snap selection, orientation, loop boundaries, control availability, and optional autoplay. AngularTS remains responsible for counters, business actions, and other application state consumed from the carousel DOM events.",
  chart:
    "Semantic figure, heading, list, and data markup owns chart meaning. CSS variables provide visual values and colors; authored HTML, SVG, canvas, or an application-selected chart library owns plotting, scales, data, formatting, and interaction. AngularCSS registers no chart directive.",
  combobox:
    "The directive owns disclosure, collision-aware placement, active-descendant navigation, enabled-option boundaries, Escape and outside dismissal, and selection, clear, remove-last, and open-change signaling. AngularTS remains responsible for query filtering, selected values and collections, controlled open state, validation, and structural bindings such as `ng-repeat`, `ng-if`, and `ng-model`.",
  command:
    "The directive follows the application-rendered result DOM and owns active-descendant navigation, enabled-option wrapping and boundaries, pointer synchronization, Enter activation through the authored click handler, semantic group and empty state, and scroll-to-active behavior. AngularTS remains responsible for query filtering, command execution, result data, structural bindings, and application keyboard shortcuts. Dialog remains responsible for modal disclosure, focus trapping, Escape, outside dismissal, and focus restoration.",
  "context-menu":
    "The directive owns right-click and keyboard disclosure, cursor-relative side placement with viewport collision constraints, menu and submenu focus movement, disabled-item skipping, Escape and outside dismissal, direction-aware submenu keys, semantic roles, and open-state reflection. AngularTS remains responsible for command execution, checkbox and radio values, controlled application state, and structural rendering.",
  dialog:
    "A native `dialog` opened with `command=show-modal` owns top-layer rendering, modal focus, Escape, background isolation, and trigger focus restoration. Declarative `command=close` controls dismiss it. AngularTS remains responsible for form models, validation, submission, authored content, and application state.",
  drawer:
    "A native `dialog` owns modal disclosure, focus, Escape, background isolation, and restoration. Authored `data-side` selects CSS edge placement. AngularTS remains responsible for form models, goal values, validation, submission, responsive application composition, and authored content.",
  collapsible:
    "Native `details` and `summary` own disclosure, focus, and keyboard behavior. Use `open` for initial state and AngularTS only when application state must observe or control the native element. AngularCSS registers no collapsible directive.",
  "hover-card":
    "The directive owns delayed pointer and focus disclosure, physical side placement, Escape closure, and synchronized open state. It is non-modal and does not trap focus. Applications own preview content and may control the authored `data-open` attribute.",
  input:
    "Input is a styling-only native control selected by `.input`. AngularTS and the browser own value, events, model synchronization, validation, disabled and required state, and form submission. AngularCSS registers no input directive.",
  "input-otp":
    "Input OTP is one styling-only native `input`. The browser owns typing, editing, paste, password-manager autofill, `autocomplete=one-time-code`, input mode, length, pattern validation, and form submission; AngularTS `ng-model` owns application state. AngularCSS registers no input-otp directive.",
  menubar:
    "The directive owns top-level roving focus, menu and submenu disclosure, enabled-item navigation, Escape and outside-click closure, DOM-order synchronization for dynamically inserted menus, and direction-aware horizontal keys. AngularTS remains responsible for command execution, checkbox and radio values, and structural content such as `ng-if`.",
  "native-select":
    "The native `select` owns value selection, keyboard interaction, option groups, disabled behavior, validation, and form submission. AngularTS `ng-model` remains the application source of truth. AngularCSS registers no native-select directive.",
  "navigation-menu":
    "The directive owns site-navigation disclosure, focus restoration, direction-aware arrow movement, dynamic DOM-order synchronization, outside dismissal, and flyout collision handling. Native links continue to own navigation. URLs, routing, current-page state, authored controlled state, and application commands remain AngularTS or application concerns.",
  pagination:
    "Native navigation, lists, list items, and links own pagination semantics and navigation. URLs, routing, page counts, rows-per-page values, and current-page application state remain AngularTS or application concerns. AngularCSS registers no pagination directive.",
  progress:
    "The native `progress` element owns progressbar semantics and determinate or indeterminate state. Native `label` and `output` elements provide optional context. AngularTS may bind `value`; AngularCSS registers no progress directive.",
  "radio-group":
    "A native `fieldset` and `legend` group radio inputs sharing one `name`. The browser owns selection, arrow-key behavior, disabled state, validation, and form submission; AngularTS `ng-model` owns application state. AngularCSS registers no radio-group directive.",
  "scroll-area":
    "A focusable semantic region with `overflow: auto` uses the browser's native scrolling, keyboard behavior, pointer interaction, direction handling, and scrollbar geometry. AngularTS may insert or remove content; native layout updates the overflow automatically. AngularCSS registers no scroll-area directive.",
  resizable:
    "The directive owns pairwise pointer and keyboard resizing, minimum and maximum bounds, direct-child panel/handle ownership, direction-aware deltas, and synchronized separator state. AngularTS or the application owns authored orientation, initial/external sizes, structural insertion, persistence, and business layout decisions.",
  select:
    "The native `select` owns values, option groups, keyboard interaction, disabled state, validation, and form submission. AngularTS supplies option registration, `ng-model`, validators, and form-state classes. AngularCSS registers no select directive.",
  sheet:
    "A native `dialog` owns modal disclosure, focus, Escape, background isolation, and restoration. Authored `data-side` selects CSS edge placement. AngularTS remains responsible for form values, validation, submission, language, and authored content.",
  sidebar:
    "The directive reflects authored side, variant, collapsible, direction, responsive, active-item, group, and trigger state. It owns only sidebar collapse and accessibility synchronization; `collapsible=none` stays expanded, off-canvas collapse hides the landmark, and icon collapse keeps visible controls accessible. AngularTS remains responsible for controlled open state, shortcuts, filtering, routing, application actions, and structural rendering. Compose nested disclosure with the existing Collapsible primitive and menus with the existing Dropdown primitive.",
  popover:
    "The native Popover API owns non-modal disclosure, top-layer rendering, outside pointer dismissal, and Escape closure. `popovertarget` connects the invoker to the `popover` element. AngularTS remains responsible for authored content, form values, and application state.",
  tooltip:
    "The directive owns immediate hover and focus disclosure, Escape closure, synchronized controlled open state, text direction, and physical side placement. Tooltip content is descriptive, non-interactive, and never receives focus. AngularTS remains responsible for application state and the trigger action.",
  "toggle-group":
    "Toggle Group is a styling-only native `fieldset`: use radios sharing a `name` for single selection and checkboxes for multiple selection. The browser owns selection, arrow-key radio navigation, disabled state, focus, validation, and form submission; AngularTS `ng-model` owns application state. AngularCSS registers no toggle-group directive.",
};

const accessibilityByCategory: Record<string, string> = {
  action:
    "Use a native `button` whenever the control performs an action. Keep an accessible name, preserve visible focus, and use `disabled` for unavailable native controls.",
  "command palette":
    "The input and result list are connected through ARIA relationships. Visible items participate in active-descendant keyboard navigation; disabled items are skipped.",
  "data display":
    "Keep meaningful labels and table or figure structure in authored HTML. Do not rely on color, position, or generated visual marks as the only representation of data.",
  "date input":
    "Day buttons expose selected, current, disabled, and range state. Provide a descriptive calendar title and an accessible label or value for every day.",
  disclosure:
    "Triggers and panels are connected with `aria-controls` and `aria-labelledby`. Expanded and hidden state is synchronized as the disclosure changes.",
  feedback:
    "Use the appropriate live-region or status semantics for dynamic feedback. Decorative feedback must stay hidden from assistive technology.",
  form: "Associate every control with a visible label. Native required, disabled, and invalid semantics are preserved and mirrored rather than replaced.",
  "form overlay":
    "The control, popup, and options are connected with ARIA relationships. Keyboard focus and active-item state remain visible, and disabled options are skipped.",
  layout:
    "Prefer semantic landmarks and native elements inside the layout. Any interactive handles or triggers must retain an accessible name and visible focus indicator.",
  media:
    "Provide useful alternative text for meaningful media. Mark decorative media as hidden and ensure fallback content communicates the same identity.",
  menu: "Triggers expose popup and expanded state. Arrow keys move among enabled items, Escape closes the menu, and focus returns to the invoking control when appropriate.",
  navigation:
    "Use semantic navigation landmarks and links. Expose the current destination with `aria-current` and keep keyboard order consistent with visual order.",
  overlay:
    "Provide a visible title and description when the overlay needs context. Modal overlays trap focus, close on Escape, and restore focus to their trigger.",
  text: "Keep the text available to assistive technology and add an accessible label when a visual abbreviation would otherwise be ambiguous.",
  utility:
    "The authored direction and language remain the semantic source of truth. Mirrored attributes are styling hooks, not replacement semantics.",
};

const accessibilityByComponent: Record<string, string> = {
  field:
    "Connect every control to a native label. Give descriptions and errors stable IDs and author `aria-describedby` on the control. Use native `fieldset` and `legend` only for actual groups of related controls.",
  "input-group":
    "Keep one clearly labeled native control in each group. Use `aria-describedby` for explanatory addon text, `aria-hidden` for decorative text, and a native `label for` when an addon should focus the control.",
  avatar:
    "Give meaningful portrait images useful alternative text. Give fallback-only avatars an accessible name when initials are ambiguous, and keep decorative status badges out of repeated announcements.",
  "alert-dialog":
    "Connect the native dialog to a concise title and consequence description with `aria-labelledby` and `aria-describedby`. Put the least destructive action first in focus order and use `closedby=closerequest` when outside dismissal would be unsafe.",
  accordion:
    "Use a direct `summary` as the accessible trigger for each `details` item. The browser exposes disclosure state and keyboard activation. Use `inert` only when an entire unavailable disclosure must be removed from interaction.",
  collapsible:
    "Use a direct `summary` as the accessible trigger. The browser exposes disclosure state and provides Enter and Space activation without authored roles or ARIA state.",
  calendar:
    "Give the calendar or its visible title a useful accessible name. Generated weekdays are column headers; week numbers are row headers; day buttons expose selected, current, disabled, outside, booked, and range state. Arrow keys, Home, End, Page Up, and Page Down move through the date grid, while RTL reverses horizontal movement. Date Picker triggers must keep an accessible name and preserve focus through the composed Popover.",
  carousel:
    "The root is an accessible carousel region, every authored item is exposed as a labeled slide, and unavailable previous or next controls are disabled. Give the region a useful accessible name and keep authored slide content semantic.",
  chart:
    "Give every chart root a useful accessible name and provide a textual or tabular equivalent when exact values matter. Bars expose authored labels and values; axes and legends are lists; grid decoration is hidden; visible tooltips are status regions. Never use color as the only distinction between series.",
  combobox:
    "Give the input an accessible name. The input exposes combobox, expanded, controls, autocomplete, invalid, disabled, and active-descendant state connected to a listbox. Arrow keys, Home, End, Enter, Escape, and Tab operate on enabled visible options; labeled groups retain group relationships, multiple listboxes expose `aria-multiselectable`, and text direction is mirrored to the popup.",
  command:
    "Give the search input and command surface useful accessible names. The input is connected to a listbox through `aria-controls` and `aria-activedescendant`; rendered options expose selected and disabled state, labeled groups retain group relationships, separators are decorative structure, and shortcut labels are hidden from repeated announcement. A modal composition must include an accessible Dialog title and description.",
  "context-menu":
    "Give the trigger and menu useful accessible names. The trigger exposes `aria-haspopup`, `aria-controls`, and expanded state; items receive menuitem, menuitemcheckbox, or menuitemradio roles; groups and separators remain semantic; disabled items are skipped. Shift+F10 or the Context Menu key opens from the keyboard, arrow keys move focus, logical submenu keys follow text direction, and Escape restores focus.",
  dialog:
    "Use a visible title and description connected with `aria-labelledby` and `aria-describedby`. Native modal dialogs contain focus, isolate the background, close on Escape, and restore focus to their declarative invoker.",
  drawer:
    "Use a visible title and description connected to the native dialog. Keep the physical edge as presentation only; content order, focus order, and inherited text direction remain semantic.",
  sheet:
    "Use a visible title and description connected to the native dialog. Keep the physical edge as presentation only; content order, focus order, and inherited text direction remain semantic.",
  sidebar:
    "Give the sidebar landmark and icon-only actions useful accessible names. Triggers expose `aria-controls` and expanded state, groups are associated with visible labels, and the current destination uses `aria-current=page`. Off-canvas collapse hides the landmark and restores trigger focus when necessary; icon collapse preserves access to its visible controls. Keep DOM order aligned with physical placement and use native links for destinations.",
  "hover-card":
    "The trigger exposes `aria-controls` and `aria-expanded`; the preview exposes its hidden state without becoming modal. Keep the trigger keyboard focusable, preserve readable content order, and do not place essential information only inside a hover card.",
  input:
    "Use a native input with a visible label. Preserve native type, name, autocomplete, required, disabled, and validation semantics; use AngularTS `ng-model` for application state and `aria-invalid` when application validation must be exposed explicitly.",
  menubar:
    'The root exposes `role="menubar"` and keeps one enabled top-level trigger in the tab order. Triggers identify their menus with `aria-controls`; disabled triggers and items are skipped. Arrow keys follow visual direction, submenu keys remain local to the submenu, and Escape restores focus to the active trigger.',
  "native-select":
    "Use a visible `label` connected by `for` and `id`, or provide another accessible name when the surrounding composition already labels the control. Native option, optgroup, disabled, required, invalid, and direction semantics are preserved rather than recreated.",
  "navigation-menu":
    "Use a native `nav` landmark containing a list. Keep destinations as native links and disclosure controls as native buttons; do not add menu or menuitem roles to site navigation. Triggers expose `aria-expanded` and `aria-controls`, direct links remain in horizontal keyboard order, and Escape restores focus to the active trigger.",
  pagination:
    'Use a native `nav` landmark with an accessible label, a native list, and native links. Expose exactly one current destination with `aria-current="page"`. Previous and next links need destination-specific accessible names; ellipsis is decorative and removed from the accessibility tree.',
  progress:
    "Give every native progress element an accessible name with `label`, `aria-label`, or `aria-labelledby`. Set `value` and `max` for determinate progress; omit `value` for indeterminate progress.",
  "radio-group":
    "Use native radio inputs with a shared `name` and an explicit label for every control. Use `fieldset` and `legend` for a visible group label when appropriate. Preserve native disabled and invalid semantics, and connect supporting descriptions with `aria-describedby`.",
  resizable:
    "Give each resize handle a concise accessible name. Handles expose separator semantics, the physical resize axis through `aria-orientation`, current and bounded values, and `aria-controls` relationships to both adjacent panels. Keyboard resizing follows text direction and preserves visible focus.",
  select:
    "Use a visible `label` connected by `for` and `id`, or provide another accessible name. Preserve native option, optgroup, multiple, disabled, required, invalid, and direction semantics; AngularTS reflects model and validation state without replacing them.",
  popover:
    "Use a native button invoker and give the popover content a useful accessible name when its context is not otherwise clear. Escape and pointer light-dismiss are browser behavior; add `autofocus` only when moving focus into the content is appropriate.",
  tooltip:
    'The trigger exposes `aria-describedby` while the content uses `role="tooltip"`. Tooltips open from hover and keyboard focus, close on Escape, and must not contain interactive controls or essential information. Wrap a disabled button in a hoverable trigger only when its unavailable state needs explanation.',
};

const cssVariablesByComponent: Record<string, string[]> = {
  carousel: ["--carousel-gap", "--carousel-item-size"],
  chart: ["--chart-color", "--value"],
};

const composedStateSlotsByComponent: Record<string, string[]> = {
  field: ["checkbox", "radio-group-item", "switch"],
};

const readAttributesByComponent: Record<string, string[]> = {
  carousel: [
    "align",
    "autoplay",
    "autoplay-delay",
    "contain-scroll",
    "data-active",
    "data-orientation",
    "dir",
    "drag-free",
    "draggable",
    "loop",
    "orientation",
    "skip-snaps",
    "slides-to-scroll",
  ],
  checkbox: ["checked", "disabled", "required"],
  combobox: [
    "aria-disabled",
    "aria-invalid",
    "aria-selected",
    "auto-highlight",
    "data-auto-highlight",
    "data-multiple",
    "data-open",
    "data-value",
    "dir",
    "disabled",
    "hidden",
    "multiple",
    "open",
    "required",
  ],
  command: ["aria-disabled", "dir", "disabled", "hidden"],
  "context-menu": [
    "align",
    "align-offset",
    "aria-checked",
    "aria-disabled",
    "data-open",
    "dir",
    "disabled",
    "side",
    "side-offset",
  ],
  dialog: ["data-open", "dir", "disabled"],
  drawer: ["data-open", "dir", "direction", "disabled", "side"],
  sheet: ["data-open", "dir", "disabled", "side"],
  "hover-card": ["close-delay", "open-delay"],
  "native-select": ["aria-invalid", "disabled", "required"],
  "navigation-menu": ["align", "data-open", "data-state", "dir", "disabled"],
  pagination: ["aria-current", "aria-disabled", "data-active", "dir"],
  popover: ["data-align", "data-side", "popover", "popovertarget"],
  progress: ["dir", "max", "value"],
  "radio-group": [
    "aria-invalid",
    "checked",
    "dir",
    "disabled",
    "name",
    "required",
    "value",
  ],
  resizable: [
    "aria-disabled",
    "aria-orientation",
    "data-max-size",
    "data-min-size",
    "data-step",
    "dir",
    "orientation",
  ],
  select: ["aria-invalid", "dir", "disabled", "multiple", "name", "required"],
  tooltip: ["side"],
};

const writtenAttributesByComponent: Record<string, string[]> = {
  dialog: [
    "aria-controls",
    "aria-describedby",
    "aria-expanded",
    "aria-haspopup",
    "aria-hidden",
    "aria-labelledby",
    "aria-modal",
    "data-direction",
    "data-open",
    "data-state",
    "hidden",
    "role",
    "tabindex",
    "type",
  ],
  drawer: [
    "aria-controls",
    "aria-describedby",
    "aria-expanded",
    "aria-haspopup",
    "aria-hidden",
    "aria-labelledby",
    "aria-modal",
    "data-direction",
    "data-open",
    "data-side",
    "data-state",
    "hidden",
    "role",
    "tabindex",
    "type",
  ],
  sheet: [
    "aria-controls",
    "aria-describedby",
    "aria-expanded",
    "aria-haspopup",
    "aria-hidden",
    "aria-labelledby",
    "aria-modal",
    "data-direction",
    "data-open",
    "data-side",
    "data-state",
    "hidden",
    "role",
    "tabindex",
    "type",
  ],
  sidebar: [
    "aria-controls",
    "aria-current",
    "aria-expanded",
    "aria-hidden",
    "aria-labelledby",
    "collapsible",
    "data-active",
    "data-collapsible",
    "data-direction",
    "data-mobile",
    "data-open",
    "data-side",
    "data-state",
    "data-variant",
    "dir",
    "role",
    "side",
    "type",
    "variant",
  ],
};

const slotGuidanceByComponent: Record<string, string> = {
  avatar:
    "Apply `.avatar` to a wrapper containing either an image or authored fallback content. Badges are optional. Use `.avatar-group` for several avatars and `.avatar-group-count` for a remaining count.",
  "alert-dialog":
    "Use `.alert-dialog` as an optional composition wrapper, a native button with `command=show-modal`, and `dialog.alert-dialog-content`. Close controls use `command=close`; no overlay element or nested AngularCSS attributes are required.",
  accordion:
    "Use `.accordion` around direct `details` children. Each item requires a direct `summary` followed by authored content. Apply the same `name` to sibling details for exclusive disclosure.",
  carousel:
    "The content viewport and its direct track child are required. Items must be direct track children. Navigation controls and dots are optional.",
  chart:
    "The chart root requires an accessible name. Plot, bar, axis, grid, legend, and tooltip slots are optional composition primitives; place them inside the chart root so synchronized CSS properties and semantics apply.",
  combobox:
    "A combobox root requires one input and one listbox content element. The root directive inspects semantic descendants through combobox part classes; no child directives are required. Control, trigger, clear, empty, groups, separators, and chips are optional.",
  command:
    "A command root requires one input and one list. The root directive inspects semantic descendants through command part classes; no child directives are required. Empty state, labeled groups, separators, item icons, and shortcuts are optional. Compose modal palettes from Dialog.",
  "context-menu":
    "A context menu root requires one focusable trigger and one menu element. The root directive inspects semantic descendants through context-menu part classes; no child directives are required. Groups, separators, shortcuts, checked items, and submenus are optional.",
  dialog:
    "Use `.dialog` as an optional composition wrapper, a native button with `command=show-modal`, and `dialog.dialog-content`. Close controls use `command=close`; no overlay element or nested AngularCSS attributes are required.",
  drawer:
    "Use `.drawer` as an optional wrapper, a native invoker button, and `dialog.drawer-content` with authored `data-side`. Close controls use `command=close`; no overlay element is required.",
  sheet:
    "Use `.sheet` as an optional wrapper, a native invoker button, and `dialog.sheet-content` with authored `data-side`. Close controls use `command=close`; no overlay element is required.",
  sidebar:
    "Place `aside[ng-sidebar]` inside `.sidebar-layout` and connect native button triggers with `aria-controls`. The root directive inspects semantic descendants through sidebar part classes; no child sidebar directives are required. Author side, variant, and collapse mode on the root. Compose nested disclosure with Collapsible and action menus with Dropdown.",
  collapsible:
    "Apply `.collapsible` to a native `details` element with a direct `summary` followed by authored content. No nested AngularCSS attributes are required.",
  "hover-card":
    "A keyboard-focusable trigger and one preview content element are required. Title and description slots are optional semantic styling hooks inside the preview.",
  "input-group":
    "Use one native input, textarea, select, combobox, or spinbutton inside `.input-group`. Addons may be placed at inline-start, inline-end, block-start, or block-end with `data-align`. Buttons, menus, tooltips, and popovers retain their own behavior.",
  menubar:
    "Each menu requires one native button trigger and one menu content element. The root directive inspects semantic descendants through menubar part classes; no child directives are required. Groups, separators, shortcuts, checked items, and submenus are optional.",
  "native-select":
    "Apply `.native-select` directly to a native `select` inside an optional wrapper. Native `option` and `optgroup` elements need no additional attributes. A wrapper may provide a custom icon.",
  "navigation-menu":
    "Use a native `nav` containing one direct list. Each list item may contain either a native link or a native button trigger followed by flyout content. The root directive inspects descendants through navigation-menu part classes; no child directives are required.",
  pagination:
    "Use a native `nav` containing a `ul` or `ol` with direct `li` children. Page, previous, and next controls remain native links. Ellipsis is optional. Compose rows-per-page controls beside Pagination with existing native form components; Pagination does not own that model.",
  popover:
    "Connect a native button's `popovertarget` to one element with the matching `id` and `popover`. Header, title, and description selectors are optional styling hooks. Use native form controls inside the content; AngularTS owns their values and validation.",
  progress:
    "Use a native `progress.progress` element. For a visible label and value, compose it with native `label` and `output` elements inside `.progress-group`.",
  "radio-group":
    'Use `fieldset.radio-group` with a native `legend`. Place labeled `input type="radio"` controls inside it and give related controls the same `name`.',
  resizable:
    "Alternate direct `.resizable-panel` and `.resizable-handle` children inside each panel group. The root directive inspects those children; no child directives are required. Nested groups belong inside a panel.",
  select:
    "Apply `.select` directly to a native `select` inside an optional `.select-wrapper`. Native `option` and `optgroup` elements need no additional attributes. Use AngularTS `ng-model`, validators, and form directives directly on the select.",
  tooltip:
    "One trigger and one plain-text content element are required. Prefer a native button or link trigger. Tooltip content is descriptive and non-interactive; use Popover when the floating content needs controls or focus.",
};

const attributeDescription = (attribute: string): string => {
  const descriptions: Record<string, string> = {
    "aria-current": "Current item or date state.",
    "aria-disabled": "Semantic disabled state.",
    "aria-expanded": "Open or expanded state exposed to assistive technology.",
    "aria-invalid": "Validation state mirrored from the control.",
    "aria-label": "Accessible name when visible text is insufficient.",
    "aria-selected": "Selected item state.",
    align: "Cross-axis alignment: `start`, `center`, or `end`.",
    autoplay: "Enables the locally bundled Embla autoplay plugin.",
    "autoplay-delay": "Autoplay delay in milliseconds.",
    checked: "Initial native checked state.",
    "close-delay": "Pointer close delay in milliseconds.",
    "contain-scroll": "Embla scroll containment mode.",
    "data-value-format":
      "Set to `custom` to preserve application-authored value text.",
    dir: "Text and interaction direction: `ltr` or `rtl`.",
    disabled: "Disables native or component interaction.",
    "drag-free": "Allows free dragging between snap points.",
    draggable: "Set to `false` to disable pointer dragging.",
    loop: "Allows navigation to wrap from the final item to the first.",
    max: "Maximum native or component value.",
    min: "Minimum native or component value.",
    multiple: "Allows more than one item to remain selected or open.",
    open: "Initial or controlled open state.",
    "open-delay": "Pointer open delay in milliseconds.",
    orientation: "Layout direction: `horizontal` or `vertical`.",
    position: "Placement token used by the component surface.",
    required: "Marks a native form value as required.",
    role: "Explicit semantic role when native HTML does not provide one.",
    side: "Physical placement: `left`, `top`, `bottom`, or `right`.",
    size: "Visual size token supported by the component stylesheet.",
    "skip-snaps": "Allows momentum to skip snap points.",
    "slides-to-scroll": "Number of slides advanced as one snap group.",
    tabindex: "Keyboard focus order for composite descendants.",
    type: "Component or native behavior variant.",
    value: "Native value or authored component value.",
    variant: "Visual variant token supported by the component stylesheet.",
  };

  if (descriptions[attribute]) return descriptions[attribute];
  if (attribute.startsWith("aria-")) return "ARIA relationship or state.";
  if (attribute.startsWith("data-"))
    return "Stable component state or styling hook.";
  return "Authored option or semantic HTML attribute observed by the directive.";
};

const renderList = (values: string[], empty: string): string =>
  values.length > 0
    ? values.map((value) => `- \`${value}\``).join("\n")
    : empty;

const renderAttributeTable = (
  readAttributes: string[],
  writtenAttributes: string[],
): string => {
  const attributes = unique([...readAttributes, ...writtenAttributes]);
  if (attributes.length === 0) {
    return "This component has no directive-specific attributes beyond its semantic HTML.";
  }

  const rows = attributes.map((attribute) => {
    const read = readAttributes.includes(attribute);
    const written = writtenAttributes.includes(attribute);
    const access = read && written ? "Input/output" : read ? "Input" : "Output";
    return `| \`${attribute}\` | ${access} | ${attributeDescription(attribute)} |`;
  });

  return [
    "| Attribute | Access | Purpose |",
    "| --- | --- | --- |",
    ...rows,
  ].join("\n");
};

const referenceFor = (component: string): string => {
  const source = readFileSync(
    join("src/components", component, `${component}.ts`),
    "utf8",
  );
  const styles = readStyles(
    join("src/components", component, `${component}.css`),
  );
  const directive = directiveByComponent.get(component);
  const stylingOnly = componentPolicy[component]?.kind === "element";
  const rootSelector = stylingOnly
    ? `.${component}`
    : directive
      ? toSelector(directive)
      : `ng-${component}`;
  const childSelectors = matches(source, /\b(ng-[a-z][a-z0-9-]+)/g).filter(
    (selector) => selector !== rootSelector,
  );
  const readAttributes = unique([
    ...matches(source, /(?:getAttribute|hasAttribute)\(["']([^"']+)["']\)/g),
    ...(readAttributesByComponent[component] || []),
  ]);
  const writtenAttributes = unique([
    ...matches(
      source,
      /(?:setAttribute|removeAttribute)\(\s*["']([^"']+)["']/g,
    ),
    ...matches(source, /setAttributeIfChanged\(\s*[^,]+,\s*["']([^"']+)["']/g),
    ...(source.includes("syncNativeControlState(")
      ? ["aria-disabled", "aria-required", "data-disabled", "data-required"]
      : []),
    ...(writtenAttributesByComponent[component] || []),
  ]);
  const cssVariables = unique([
    ...matches(source, /["'](--[a-z][a-z0-9-]+)["']/g).filter(
      (variable) => !variable.startsWith("--tw-"),
    ),
    ...(cssVariablesByComponent[component] || []),
  ]);
  const events = matches(source, /["'](angularcss:[a-z0-9-]+)["']/g);
  const category = categoryByComponent.get(component) ?? "layout";
  const behavior =
    behaviorByComponent[component] ??
    behaviorByCategory[category] ??
    behaviorByCategory.layout;
  const accessibility =
    accessibilityByComponent[component] ??
    accessibilityByCategory[category] ??
    accessibilityByCategory.layout;
  const installationDescription = stylingOnly
    ? `This is a styling-only HTML element or pattern. AngularCSS registers no runtime directive for it. ${componentPolicy[component]?.rationale ?? ""}`
    : "This component's root directive is `[" +
      rootSelector +
      "]`. Importing the package registers it with the AngularCSS `ui` module; there is no per-component JavaScript registration step.";
  const selectorHeading = stylingOnly
    ? "### Root styling selector"
    : "### Directive selectors";
  const stateOwnership = stylingOnly
    ? "Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state."
    : "`Input` attributes are read from authored HTML. `Output` attributes are maintained by AngularCSS for CSS and testing. `Input/output` attributes may be authored for a controlled initial state and are then synchronized by the directive.";
  const cssVariableFallback = stylingOnly
    ? "This styling hook does not define component-specific CSS custom properties."
    : "This directive does not write component-specific CSS custom properties.";
  const customization = stylingOnly
    ? "Target semantic elements, native state selectors, and component classes from Tailwind or ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet."
    : "Target `[" +
      rootSelector +
      "]`, semantic descendants, component classes, and generated state from Tailwind or ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.";

  const selectorList = [rootSelector, ...childSelectors];

  return `${START}
## Installation

Install AngularCSS once, load its stylesheet, and include the \`ui\` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

${installationDescription}

## Anatomy

${selectorHeading}

${renderList(selectorList, "This component uses semantic HTML without child directives.")}

### Semantic structure

${slotGuidanceByComponent[component] ?? "Use native elements for authored structure. Component classes are optional visual hooks when an HTML relationship is not specific enough."}

## API

### Attributes and state

${renderAttributeTable(readAttributes, writtenAttributes)}

${stateOwnership}

### CSS custom properties

${renderList(cssVariables, cssVariableFallback)}

### DOM events

${renderList(
  events,
  "This component does not emit a component-specific custom event.",
)}

Native DOM events continue to work normally. AngularTS event directives such as
\`ng-click\` and \`ng-keydown\`, plus the \`data-change\` model callback, remain application-owned.

## Behavior

${behavior}

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

${accessibility}

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

${customization}

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
${END}`;
};

const stripReference = (source: string): string => {
  const start = source.indexOf(START);
  if (start === -1) return source.trimEnd();
  const end = source.indexOf(END, start);
  if (end === -1) throw new Error(`Missing ${END}`);
  return `${source.slice(0, start)}${source.slice(end + END.length)}`.trimEnd();
};

const stripElementReference = (source: string): string => {
  const start = source.indexOf(ELEMENT_START);
  if (start === -1) return source.trimEnd();
  const end = source.indexOf(ELEMENT_END, start);
  if (end === -1) throw new Error(`Missing ${ELEMENT_END}`);
  return `${source.slice(0, start)}${source.slice(end + ELEMENT_END.length)}`.trimEnd();
};

const addExampleHeading = (source: string): string => {
  if (/^## Example$/m.test(source)) return source;
  return source.replace(/\n(\{\{< example\s)/, "\n## Example\n\n$1");
};

const addCategory = (source: string, component: string): string => {
  if (/^category:/m.test(source)) return source;
  const category = categoryByComponent.get(component) ?? "layout";
  return source.replace(
    /^(title:\s*.+)$/m,
    `$1\ncategory: ${JSON.stringify(category)}`,
  );
};

const failures: string[] = [];

for (const component of componentNames) {
  const pagePath = join("docs/content/docs/components", `${component}.md`);
  const current = readFileSync(pagePath, "utf8");
  const authored = addCategory(
    addExampleHeading(
      stripReference(current).replace(/^notoc:\s*true\s*\n/m, ""),
    ),
    component,
  );
  const expected = `${authored}\n\n${referenceFor(component)}\n`;

  if (checkOnly) {
    if (current !== expected) failures.push(pagePath);
  } else {
    writeFileSync(pagePath, expected);
  }

  const elementPath = join("docs/content/docs/elements", `${component}.md`);
  if (!existsSync(elementPath)) continue;

  const currentElement = readFileSync(elementPath, "utf8");
  const authoredElement = addExampleHeading(
    stripElementReference(currentElement),
  );
  const elementContract =
    componentPolicy[component]?.kind === "element"
      ? `This element entrypoint exports no runtime behavior. Native HTML, CSS, and AngularTS own the complete contract.`
      : `This element entrypoint re-exports the canonical \`${component}\` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.`;
  const expectedElement = `${authoredElement}\n\n${ELEMENT_START}
## Canonical reference

${elementContract}

Read the [complete ${component} component reference]({{< relref
"/docs/components/${component}" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
${ELEMENT_END}\n`;

  if (checkOnly) {
    if (currentElement !== expectedElement) failures.push(elementPath);
  } else {
    writeFileSync(elementPath, expectedElement);
  }
}

if (failures.length > 0) {
  console.error("Component documentation is stale. Regenerate these pages:");
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(
  checkOnly
    ? `Documentation check passed for ${componentNames.length} components and element entrypoints.`
    : `Generated reference sections for ${componentNames.length} components and element entrypoints.`,
);
