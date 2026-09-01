---
title: field
category: 'form'
description: >
  Group labels, helper text, and errors with semantic field wrapper selectors.
---

Use the field wrapper and field parts to define standard form structure.

```html
<div class="field">
  <label for="email" class="field-label label">Email</label>
  <input id="email" type="email" placeholder="Email" class="input" />
  <p class="field-description">Use your work email.</p>
</div>

<div data-invalid class="field">
  <label for="invalid-email" class="field-label label">Email</label>
  <input id="invalid-email" aria-invalid="true" class="input" />
  <p class="field-error">Enter a valid email.</p>
</div>
```

## Example

{{< example src="examples/components/field.html" title="Field example" height="300" >}}

## Workflows

{{< example src="examples/components/field-workflows.html" title="Field workflows" height="2500" >}}

## Validation States

Fields mirror native validity and keep descriptions synchronized when AngularTS
structural directives insert controls.

{{< example src="examples/components/field-state-workflows.html" title="Field validation and conditional controls" height="760" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This component's root directive is `[ng-field]`. Importing the package registers it with the AngularCSS `ui` module; there is no per-component JavaScript registration step.

## Anatomy

### Directive selectors

- `ng-field`

### Semantic structure

Use native elements for authored structure. Component classes are optional visual hooks when an HTML relationship is not specific enough.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-describedby` | Input/output | ARIA relationship or state. |
| `aria-invalid` | Input | Validation state mirrored from the control. |
| `data-invalid` | Output | Stable component state or styling hook. |
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

Target `[ng-field]`, semantic descendants, component classes, and generated state from Tailwind or ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
