---
title: toggle-group
category: 'action'
description: >
  A semantic button group that coordinates pressed-state selection.
---

Use `ng-toggle-group` on a `fieldset` containing native
`button.toggle-group-item` controls. The directive supplies any required roles.

```html
<fieldset ng-toggle-group variant="outline" class="toggle-group">
  <button aria-pressed="true" class="toggle-group-item">Left</button>
  <button class="toggle-group-item">Center</button>
  <button class="toggle-group-item">Right</button>
</fieldset>
```

## Example

{{< example src="examples/components/toggle-group.html" title="Toggle group example" height="180" >}}

## Workflows

{{< example src="examples/components/toggle-group-workflows.html" title="Toggle group state and layout workflows" height="1260" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This component's root directive is `[ng-toggle-group]`. Importing the package registers it with the AngularCSS `ui` module; there is no per-component JavaScript registration step.

## Anatomy

### Directive selectors

- `ng-toggle-group`

### Semantic structure

Use native elements for authored structure. Component classes are optional visual hooks when an HTML relationship is not specific enough.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-disabled` | Input | Semantic disabled state. |
| `aria-pressed` | Input/output | ARIA relationship or state. |
| `data-direction` | Output | Stable component state or styling hook. |
| `data-disabled` | Output | Stable component state or styling hook. |
| `data-orientation` | Output | Stable component state or styling hook. |
| `data-state` | Input/output | Stable component state or styling hook. |
| `dir` | Input | Text and interaction direction: `ltr` or `rtl`. |
| `disabled` | Input | Disables native or component interaction. |
| `multiple` | Input | Allows more than one item to remain selected or open. |
| `orientation` | Input | Layout direction: `horizontal` or `vertical`. |
| `role` | Input/output | Explicit semantic role when native HTML does not provide one. |
| `spacing` | Input | Authored option or semantic HTML attribute observed by the directive. |
| `tabindex` | Input/output | Keyboard focus order for composite descendants. |
| `type` | Input | Component or native behavior variant. |

`Input` attributes are read from authored HTML. `Output` attributes are maintained by AngularCSS for CSS and testing. `Input/output` attributes may be authored for a controlled initial state and are then synchronized by the directive.

### CSS custom properties

- `--gap`

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

The directive mirrors interaction state for styling and supplies only the keyboard behavior required by the component contract. Application commands and business state remain in AngularTS expressions.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Use a native `button` whenever the control performs an action. Keep an accessible name, preserve visible focus, and use `disabled` for unavailable native controls.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target `[ng-toggle-group]`, semantic descendants, component classes, and generated state from Tailwind or ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
