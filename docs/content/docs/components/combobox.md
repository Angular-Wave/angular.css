---
title: combobox
category: 'form overlay'
description: >
  Search input with selectable options
---

Compose a searchable listbox from semantic `ng-combobox-*` attributes. AngularTS
`ng-model`, filters, and event expressions remain the source of truth for query
and selected-value state. AngularCSS supplies popup disclosure,
active-descendant navigation, disabled handling, collision placement, and visual
state.

```html
<div
  ng-combobox
  ng-on-angularcss:combobox-select="selected=$event.detail.value; query=selected"
>
  <div ng-combobox-control>
    <input
      ng-combobox-input
      aria-label="Framework"
      ng-model="query"
      placeholder="Select a framework"
    />
    <button
      ng-combobox-trigger
      type="button"
      aria-label="Show frameworks"
    ></button>
  </div>
  <div ng-combobox-content aria-label="Framework options">
    <div ng-combobox-empty>No items found.</div>
    <div ng-combobox-list>
      <div ng-combobox-collection>
        <div
          ng-combobox-item
          ng-repeat="framework in frameworks | filter:query"
          data-value="{{ framework }}"
          ng-attr-aria-selected="{{ selected === framework }}"
        >
          {{ framework }}
        </div>
      </div>
    </div>
  </div>
</div>
```

Add `auto-highlight` when opening or filtering should highlight the first
enabled result. Without it, the popup opens without an active option until the
user presses an arrow key. Bind `angularcss:combobox-open-change` when the root
uses controlled `open="{{ state.open }}"` state.

For multiple selection, add `multiple`, render chips from AngularTS state, and
bind each option's `aria-selected` value. Selection events include
`multiple: true`; `angularcss:combobox-remove-last` only signals Backspace on an
empty chip input. AngularCSS never replaces the application's collection.

## Example

{{< example src="examples/components/combobox.html" title="Combobox example" height="620" >}}

## Reference Workflows

Clear, disabled, grouped, input-addon, invalid, and separate popup-trigger
compositions are functional in this artifact. Use `ng-combobox-value` for a
trigger's selected-value label. When a composition needs a compact authored
button inside an input shell, reuse the existing `ng-input-group-button`
primitive rather than recreating Input Group behavior in Combobox.

{{< example src="examples/components/combobox-workflows.html" title="Combobox workflows" height="980" >}}

## Custom, Multiple, And RTL

Custom option content and chip collections remain ordinary authored HTML and
AngularTS application state.

{{< example src="examples/components/combobox-compositions.html" title="Combobox compositions" height="620" >}}

## Controlled State

The state artifact covers controlled disclosure, disabled-option skipping, Home
and End navigation, dynamic options, and outside dismissal.

{{< example src="examples/components/combobox-state-workflows.html" title="Combobox state workflows" height="520" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This component's root directive is `[ng-combobox]`. Importing the package registers it with the AngularCSS `ui` module; there is no per-component JavaScript registration step.

## Anatomy

### Directive selectors

- `ng-combobox`
- `ng-combobox-chip`
- `ng-combobox-chip-input`
- `ng-combobox-chips`
- `ng-combobox-clear`
- `ng-combobox-content`
- `ng-combobox-control`
- `ng-combobox-empty`
- `ng-combobox-group`
- `ng-combobox-group-label`
- `ng-combobox-input`
- `ng-combobox-item`
- `ng-combobox-label`
- `ng-combobox-separator`
- `ng-combobox-trigger`
- `ng-input-group-input`

### Styling slots

- `[data-slot="combobox"]`
- `[data-slot="combobox-chip"]`
- `[data-slot="combobox-chip-input"]`
- `[data-slot="combobox-chip-remove"]`
- `[data-slot="combobox-chips"]`
- `[data-slot="combobox-clear"]`
- `[data-slot="combobox-collection"]`
- `[data-slot="combobox-content"]`
- `[data-slot="combobox-control"]`
- `[data-slot="combobox-empty"]`
- `[data-slot="combobox-group"]`
- `[data-slot="combobox-group-label"]`
- `[data-slot="combobox-input"]`
- `[data-slot="combobox-item"]`
- `[data-slot="combobox-label"]`
- `[data-slot="combobox-list"]`
- `[data-slot="combobox-separator"]`
- `[data-slot="combobox-trigger"]`
- `[data-slot="combobox-value"]`
- `[data-slot="input"]`

A combobox root requires one input and one listbox content element. Control, trigger, clear, empty, list, collection, labeled group, separator, chips, chip, and chip-remove selectors are optional composition primitives. Prefer semantic `ng-combobox-*` attributes when AngularCSS supplies behavior and styling; use `data-slot` only as a styling hook when behavior is supplied elsewhere, and never duplicate both on one element.
Use the named slots as stable Tailwind and CSS selectors.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-activedescendant` | Output | ARIA relationship or state. |
| `aria-autocomplete` | Input/output | ARIA relationship or state. |
| `aria-controls` | Output | ARIA relationship or state. |
| `aria-disabled` | Input/output | Semantic disabled state. |
| `aria-expanded` | Output | Open or expanded state exposed to assistive technology. |
| `aria-haspopup` | Output | ARIA relationship or state. |
| `aria-hidden` | Input/output | ARIA relationship or state. |
| `aria-invalid` | Input/output | Validation state mirrored from the control. |
| `aria-label` | Input/output | Accessible name when visible text is insufficient. |
| `aria-labelledby` | Output | ARIA relationship or state. |
| `aria-multiselectable` | Output | ARIA relationship or state. |
| `aria-orientation` | Output | ARIA relationship or state. |
| `aria-selected` | Input/output | Selected item state. |
| `auto-highlight` | Input | Authored option or semantic HTML attribute observed by the directive. |
| `data-auto-highlight` | Input | Stable component state or styling hook. |
| `data-chips` | Output | Stable component state or styling hook. |
| `data-direction` | Output | Stable component state or styling hook. |
| `data-disabled` | Output | Stable component state or styling hook. |
| `data-empty` | Output | Stable component state or styling hook. |
| `data-highlighted` | Output | Stable component state or styling hook. |
| `data-invalid` | Output | Stable component state or styling hook. |
| `data-multiple` | Input/output | Stable component state or styling hook. |
| `data-open` | Input/output | Stable component state or styling hook. |
| `data-side` | Output | Stable component state or styling hook. |
| `data-state` | Output | Stable component state or styling hook. |
| `data-value` | Input/output | Stable component state or styling hook. |
| `data-visible` | Output | Stable component state or styling hook. |
| `dir` | Input | Text and interaction direction: `ltr` or `rtl`. |
| `disabled` | Input | Disables native or component interaction. |
| `hidden` | Input | Authored option or semantic HTML attribute observed by the directive. |
| `multiple` | Input | Allows more than one item to remain selected or open. |
| `open` | Input | Initial or controlled open state. |
| `required` | Input | Marks a native form value as required. |
| `role` | Output | Explicit semantic role when native HTML does not provide one. |
| `tabindex` | Output | Keyboard focus order for composite descendants. |
| `type` | Input | Component or native behavior variant. |

`Input` attributes are read from authored HTML. `Output` attributes are maintained by AngularCSS for CSS and testing. `Input/output` attributes may be authored for a controlled initial state and are then synchronized by the directive.

### CSS custom properties

- `--combobox-anchor-width`
- `--combobox-content-top`

### DOM events

- `angularcss:combobox-clear`
- `angularcss:combobox-open-change`
- `angularcss:combobox-remove-last`
- `angularcss:combobox-select`

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

The directive owns disclosure, collision-aware placement, active-descendant navigation, enabled-option boundaries, Escape and outside dismissal, and selection, clear, remove-last, and open-change signaling. AngularTS remains responsible for query filtering, selected values and collections, controlled open state, validation, and structural bindings such as `ng-repeat`, `ng-if`, and `ng-model`.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Give the input an accessible name. The input exposes combobox, expanded, controls, autocomplete, invalid, disabled, and active-descendant state connected to a listbox. Arrow keys, Home, End, Enter, Escape, and Tab operate on enabled visible options; labeled groups retain group relationships, multiple listboxes expose `aria-multiselectable`, and text direction is mirrored to the popup.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target `[ng-combobox]`, the documented `data-slot` selectors, and generated `data-*` states from Tailwind or ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
