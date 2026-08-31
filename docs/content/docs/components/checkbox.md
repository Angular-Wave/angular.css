---
title: checkbox
category: 'form'
description: >
  Native checkbox control with mirrored state attributes for styling.
---

Use `ng-checkbox` on a native checkbox input. Native input state and AngularTS
`ng-model` remain the source of truth; AngularCSS reflects checked,
indeterminate, required, disabled, and invalid state into stable attributes for
Tailwind and semantic composition.

```html
<div data-slot="field" orientation="horizontal">
  <input ng-checkbox id="terms" name="terms" type="checkbox" ng-model="terms" />
  <label ng-label data-slot="field-label" for="terms"> Accept terms </label>
</div>
```

Set the native `HTMLInputElement.indeterminate` property from application code
when a mixed selection is needed. AngularCSS reflects it as
`data-state="indeterminate"` and `aria-checked="mixed"`; it does not create a
second checkbox model.

## Example

{{< example src="examples/components/checkbox.html" title="Checkbox example" height="420" >}}

## States, group, and RTL

{{< example src="examples/components/checkbox-workflows.html" title="Checkbox reference workflows" height="1200" >}}

## Table selection

{{< example src="examples/components/checkbox-compositions.html" title="Checkbox table composition" height="420" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This component's root directive is `[ng-checkbox]`. Importing the package registers it with the AngularCSS `ui` module; there is no per-component JavaScript registration step.

## Anatomy

### Directive selectors

- `ng-checkbox`

### Styling slots

- `[data-slot="checkbox"]`

Slots are optional unless the usage example or behavior description identifies a required relationship.
Use the named slots as stable Tailwind and CSS selectors.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-checked` | Output | ARIA relationship or state. |
| `aria-disabled` | Output | Semantic disabled state. |
| `aria-invalid` | Input | Validation state mirrored from the control. |
| `aria-required` | Output | ARIA relationship or state. |
| `checked` | Input | Initial native checked state. |
| `data-disabled` | Output | Stable component state or styling hook. |
| `data-invalid` | Output | Stable component state or styling hook. |
| `data-required` | Output | Stable component state or styling hook. |
| `data-state` | Output | Stable component state or styling hook. |
| `disabled` | Input | Disables native or component interaction. |
| `required` | Input | Marks a native form value as required. |

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

Target `[ng-checkbox]`, the documented `data-slot` selectors, and generated `data-*` states from Tailwind or ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
