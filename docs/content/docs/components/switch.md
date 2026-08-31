---
title: switch
category: 'form'
description: >
  Toggleable control with semantic switch state attributes.
---

Use `ng-switch-control` on native checkboxes or button roles to mirror switch
state for styling and interaction hooks. `ng-switch` is reserved for AngularTS'
built-in structural switch directive.

```html
<div data-slot="field" orientation="horizontal">
  <input ng-switch-control id="airplane-mode" type="checkbox" />
  <label ng-label for="airplane-mode">Airplane mode</label>
</div>
```

## Example

{{< example src="examples/components/switch.html" title="Switch example" height="220" >}}

## Reference Workflows

{{< example src="examples/components/switch-workflows.html" title="Switch workflows" height="980" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This component's root directive is `[ng-switch-control]`. Importing the package registers it with the AngularCSS `ui` module; there is no per-component JavaScript registration step.

## Anatomy

### Directive selectors

- `ng-switch-control`

### Styling slots

- `[data-slot="switch"]`
- `[data-slot="switch-thumb"]`

Slots are optional unless the usage example or behavior description identifies a required relationship.
Use the named slots as stable Tailwind and CSS selectors.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-checked` | Input/output | ARIA relationship or state. |
| `aria-disabled` | Input/output | Semantic disabled state. |
| `aria-invalid` | Input | Validation state mirrored from the control. |
| `aria-required` | Output | ARIA relationship or state. |
| `data-disabled` | Output | Stable component state or styling hook. |
| `data-invalid` | Output | Stable component state or styling hook. |
| `data-required` | Output | Stable component state or styling hook. |
| `data-state` | Input/output | Stable component state or styling hook. |
| `disabled` | Input | Disables native or component interaction. |
| `role` | Output | Explicit semantic role when native HTML does not provide one. |

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

Target `[ng-switch-control]`, the documented `data-slot` selectors, and generated `data-*` states from Tailwind or ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
