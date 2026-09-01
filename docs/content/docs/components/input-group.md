---
title: input-group
category: 'form'
description: >
  Grouped input controls and addon content with shared focus/description wiring.
---

Use `ng-input-group` with one native control and optional styling parts for
addons, text, and buttons. AngularTS continues to own the model and actions.

```html
<div ng-input-group class="input-group">
  <input placeholder="Search"  class="input-group-control"/>
  <div data-align="inline-start" class="input-group-addon">🔍</div>
  <div data-align="inline-end" class="input-group-addon">⌘K</div>
</div>
```

## Example

{{< example src="examples/components/input-group.html" title="Input group example" height="260" >}}

## Reference Workflows

These packaged examples cover default, disabled, invalid, inline, text, icon,
keyboard-hint, label, Button Group, and Card compositions.

{{< example src="examples/components/input-group-workflows.html" title="Input group workflows" height="2200" >}}

## Interactive Compositions

Buttons, dropdown menus, tooltips, popovers, calling-code selection, and mixed
Button Group compositions run from AngularTS bindings in the built artifact.

{{< example src="examples/components/input-group-compositions.html" title="Interactive input group compositions" height="1050" >}}

## Textarea And Block Addons

Block-start and block-end addons, textarea states, a code editor, character
counters, and the autosizing custom control remain native form controls.

{{< example src="examples/components/input-group-textarea-workflows.html" title="Input group textarea workflows" height="1750" >}}

## Right To Left

Logical addon placement and AngularTS model updates work without RTL-specific
component markup.

{{< example src="examples/components/input-group-rtl.html" title="Right-to-left input groups" height="560" >}}

## Addon States

Visible addons participate in the control description. AngularCSS preserves
external description IDs as AngularTS inserts or hides addon content.

{{< example src="examples/components/input-group-state-workflows.html" title="Input group addon and button states" height="780" >}}

Clicking a non-button addon focuses the grouped control. Interactive addon
content remains responsible for its own native or composed behavior.

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This component's root directive is `[ng-input-group]`. Importing the package registers it with the AngularCSS `ui` module; there is no per-component JavaScript registration step.

## Anatomy

### Directive selectors

- `ng-input-group`

### Semantic structure

Use one native input, textarea, select, combobox, or spinbutton control per root. Addons may be placed at inline-start, inline-end, block-start, or block-end with `data-align`. Clicking non-button addon content focuses the control; buttons, menus, tooltips, and popovers retain their existing component behavior. AngularTS owns values, validation, counters, submission, and all application actions.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-describedby` | Input/output | ARIA relationship or state. |
| `aria-hidden` | Input | ARIA relationship or state. |
| `data-addon-count` | Output | Stable component state or styling hook. |
| `data-has-addon` | Output | Stable component state or styling hook. |
| `data-has-button` | Output | Stable component state or styling hook. |
| `role` | Input/output | Explicit semantic role when native HTML does not provide one. |

`Input` attributes are read from authored HTML. `Output` attributes are maintained by AngularCSS for CSS and testing. `Input/output` attributes may be authored for a controlled initial state and are then synchronized by the directive.

### CSS custom properties

This directive does not write component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

Native form state and AngularTS `ng-model`, validation, and submission remain the source of truth. AngularCSS mirrors that state into stable styling and accessibility hooks.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Associate every control with a visible label. Native required, disabled, and invalid semantics are preserved and mirrored rather than replaced.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target `[ng-input-group]`, semantic descendants, component classes, and generated state from Tailwind or ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
