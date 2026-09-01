---
title: resizable
category: 'layout'
description: >
  Pointer- and keyboard-resizable split panels powered by `--panel-size` CSS
  variables.
---

Use `ng-resizable-panel-group` with alternating `resizable-panel` and
`resizable-handle` elements. Resize handles support pointer dragging and
keyboard control.

```html
<div ng-resizable-panel-group aria-label="Resizable layout">
  <section style="--panel-size: 1" class="resizable-panel">Preview</section>
  <hr aria-orientation="vertical"  class="resizable-handle"/>
  <section class="resizable-panel">Details</section>
</div>
```

Set `orientation="vertical"` on the group to stack panels. Handles receive
separator roles, orientation, value bounds, current values, and `aria-controls`
relationships. Dragging or pressing Arrow, Home, and End keys updates adjacent
panel `--panel-size` values within `data-min-size` and `data-max-size`; RTL
reverses horizontal changes. Add a `resizable-handle-grip` part when the handle
should have a visible grip.

## Example

{{< example src="examples/components/resizable.html" title="Resizable panels" height="250" >}}

## Orientations and RTL

{{< example src="examples/components/resizable-workflows.html" title="Resizable workflows" height="500" >}}

## Reactive Structure

{{< example src="examples/components/resizable-state-workflows.html" title="Reactive resizable structure" height="520" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This component's root directive is `[ng-resizable-panel-group]`. Importing the package registers it with the AngularCSS `ui` module; there is no per-component JavaScript registration step.

## Anatomy

### Directive selectors

- `ng-resizable-panel-group`

### Semantic structure

Alternate direct `.resizable-panel` and `.resizable-handle` children inside each panel group. The root directive inspects those children; no child directives are required. Nested groups belong inside a panel.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-controls` | Output | ARIA relationship or state. |
| `aria-disabled` | Input | Semantic disabled state. |
| `aria-orientation` | Input/output | ARIA relationship or state. |
| `aria-valuemax` | Output | ARIA relationship or state. |
| `aria-valuemin` | Output | ARIA relationship or state. |
| `aria-valuenow` | Output | ARIA relationship or state. |
| `data-direction` | Output | Stable component state or styling hook. |
| `data-index` | Output | Stable component state or styling hook. |
| `data-max-size` | Input | Stable component state or styling hook. |
| `data-min-size` | Input | Stable component state or styling hook. |
| `data-orientation` | Input/output | Stable component state or styling hook. |
| `data-resizing` | Output | Stable component state or styling hook. |
| `data-size` | Output | Stable component state or styling hook. |
| `data-step` | Input | Stable component state or styling hook. |
| `dir` | Input | Text and interaction direction: `ltr` or `rtl`. |
| `orientation` | Input | Layout direction: `horizontal` or `vertical`. |
| `role` | Output | Explicit semantic role when native HTML does not provide one. |
| `tabindex` | Input/output | Keyboard focus order for composite descendants. |

`Input` attributes are read from authored HTML. `Output` attributes are maintained by AngularCSS for CSS and testing. `Input/output` attributes may be authored for a controlled initial state and are then synchronized by the directive.

### CSS custom properties

- `--panel-size`

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

The directive owns pairwise pointer and keyboard resizing, minimum and maximum bounds, direct-child panel/handle ownership, direction-aware deltas, and synchronized separator state. AngularTS or the application owns authored orientation, initial/external sizes, structural insertion, persistence, and business layout decisions.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Give each resize handle a concise accessible name. Handles expose separator semantics, the physical resize axis through `aria-orientation`, current and bounded values, and `aria-controls` relationships to both adjacent panels. Keyboard resizing follows text direction and preserves visible focus.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target `[ng-resizable-panel-group]`, semantic descendants, component classes, and generated state from Tailwind or ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
