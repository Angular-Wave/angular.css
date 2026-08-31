---
title: select
category: 'form overlay'
description: >
  Custom select-like control with trigger/content/items and keyboard
  interactions.
---

Use `ng-select` on a wrapper with semantic trigger, value, content, group, and
item attributes. Bind application state from the emitted selection event with
AngularTS.

```html
<div ng-select ng-on-angularcss:select="status=$event.detail.value">
  <button ng-select-trigger type="button">
    <span ng-select-value ng-bind="status"></span>
  </button>
  <div ng-select-content>
    <div ng-select-group>
      <div ng-select-item data-value="todo">Todo</div>
    </div>
  </div>
</div>
```

## Example

{{< example src="examples/components/select.html" title="Select example" height="400" >}}

## Reference workflows

{{< example src="examples/components/select-workflows.html" title="Select reference workflows" height="820" >}}

## Reactive structure

{{< example src="examples/components/select-state-workflows.html" title="Select AngularTS state" height="360" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This component's root directive is `[ng-select]`. Importing the package registers it with the AngularCSS `ui` module; there is no per-component JavaScript registration step.

## Anatomy

### Directive selectors

- `ng-select`
- `ng-bind`
- `ng-model`
- `ng-select-content`
- `ng-select-group`
- `ng-select-item`
- `ng-select-label`
- `ng-select-scroll-down-button`
- `ng-select-scroll-up-button`
- `ng-select-separator`
- `ng-select-trigger`
- `ng-select-value`

### Styling slots

- `[data-slot="select"]`
- `[data-slot="select-content"]`
- `[data-slot="select-group"]`
- `[data-slot="select-item"]`
- `[data-slot="select-label"]`
- `[data-slot="select-scroll-down-button"]`
- `[data-slot="select-scroll-up-button"]`
- `[data-slot="select-separator"]`
- `[data-slot="select-trigger"]`
- `[data-slot="select-value"]`

A native button trigger and one listbox content element are required. Put options inside optional labeled groups and separators; scroll controls are optional. Use either semantic `ng-select-*` attributes or `data-slot` hooks on each element; do not duplicate both. Bind application values from `angularcss:select` with AngularTS.
Use the named slots as stable Tailwind and CSS selectors.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `align-item-with-trigger` | Input | Authored option or semantic HTML attribute observed by the directive. |
| `aria-activedescendant` | Output | ARIA relationship or state. |
| `aria-autocomplete` | Output | ARIA relationship or state. |
| `aria-controls` | Output | ARIA relationship or state. |
| `aria-disabled` | Input/output | Semantic disabled state. |
| `aria-expanded` | Output | Open or expanded state exposed to assistive technology. |
| `aria-haspopup` | Output | ARIA relationship or state. |
| `aria-hidden` | Output | ARIA relationship or state. |
| `aria-invalid` | Input | Validation state mirrored from the control. |
| `aria-label` | Input/output | Accessible name when visible text is insufficient. |
| `aria-labelledby` | Output | ARIA relationship or state. |
| `aria-orientation` | Output | ARIA relationship or state. |
| `aria-selected` | Input/output | Selected item state. |
| `data-align-trigger` | Input/output | Stable component state or styling hook. |
| `data-application-value` | Input | Stable component state or styling hook. |
| `data-direction` | Output | Stable component state or styling hook. |
| `data-disabled` | Output | Stable component state or styling hook. |
| `data-highlighted` | Output | Stable component state or styling hook. |
| `data-open` | Input/output | Stable component state or styling hook. |
| `data-scroll-end` | Output | Stable component state or styling hook. |
| `data-scroll-start` | Output | Stable component state or styling hook. |
| `data-state` | Output | Stable component state or styling hook. |
| `data-value` | Input/output | Stable component state or styling hook. |
| `dir` | Input | Text and interaction direction: `ltr` or `rtl`. |
| `disabled` | Input | Disables native or component interaction. |
| `ng-bind` | Input | Authored option or semantic HTML attribute observed by the directive. |
| `ng-model` | Input | Authored option or semantic HTML attribute observed by the directive. |
| `open` | Input | Initial or controlled open state. |
| `role` | Input/output | Explicit semantic role when native HTML does not provide one. |
| `tabindex` | Output | Keyboard focus order for composite descendants. |
| `type` | Input | Component or native behavior variant. |

`Input` attributes are read from authored HTML. `Output` attributes are maintained by AngularCSS for CSS and testing. `Input/output` attributes may be authored for a controlled initial state and are then synchronized by the directive.

### CSS custom properties

- `--select-content-top`

### DOM events

- `angularcss:select`
- `angularcss:select-open-change`

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

The directive owns popup disclosure, collision-aware placement, active-option navigation, typeahead, disabled-option skipping, scrolling, ARIA option state, and selection signaling. AngularTS remains responsible for application values through `ng-on-angularcss:select`, controlled `open` input, validation, and structural bindings such as `ng-if`.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Give the native button trigger an accessible name. The trigger exposes combobox and active-descendant relationships to a listbox whose enabled options participate in Arrow, Home, End, Enter, Space, typeahead, and Escape interaction. Groups are connected to visible labels and disabled options are skipped.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target `[ng-select]`, the documented `data-slot` selectors, and generated `data-*` states from Tailwind or ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
