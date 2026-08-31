---
title: alert
category: 'feedback'
description: >
  Compact feedback blocks for status and context.
---

Use `ng-alert` for important feedback blocks. The default presentation is
neutral; add `variant="destructive"` for destructive feedback or apply Tailwind
classes and design tokens for application-specific colors.

```html
<div ng-alert>
  <svg data-slot="alert-icon" aria-hidden="true"><!-- optional icon --></svg>
  <div data-slot="alert-title">Saved!</div>
  <div data-slot="alert-description">Your profile was updated.</div>
  <div data-slot="alert-action">
    <button ng-button ng-click="dismiss()">Dismiss</button>
  </div>
</div>
```

## Example

{{< example src="examples/components/alert.html" title="Alert examples" height="300" >}}

## Variants And Composition

{{< example src="examples/components/alert-workflows.html" title="Alert variants and composition" height="792" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This component's root directive is `[ng-alert]`. Importing the package registers it with the AngularCSS `ui` module; there is no per-component JavaScript registration step.

## Anatomy

### Directive selectors

- `ng-alert`

### Styling slots

- `[data-slot="alert"]`
- `[data-slot="alert-action"]`
- `[data-slot="alert-description"]`
- `[data-slot="alert-icon"]`
- `[data-slot="alert-title"]`

Slots are optional unless the usage example or behavior description identifies a required relationship.
Use the named slots as stable Tailwind and CSS selectors.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-atomic` | Input/output | ARIA relationship or state. |
| `aria-live` | Input/output | ARIA relationship or state. |
| `data-variant` | Input/output | Stable component state or styling hook. |
| `role` | Input/output | Explicit semantic role when native HTML does not provide one. |
| `variant` | Input | Visual variant token supported by the component stylesheet. |

`Input` attributes are read from authored HTML. `Output` attributes are maintained by AngularCSS for CSS and testing. `Input/output` attributes may be authored for a controlled initial state and are then synchronized by the directive.

### CSS custom properties

This directive does not write component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

The directive exposes presentation and announcement state. The application decides when feedback appears, changes, or is removed.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Use the appropriate live-region or status semantics for dynamic feedback. Decorative feedback must stay hidden from assistive technology.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target `[ng-alert]`, the documented `data-slot` selectors, and generated `data-*` states from Tailwind or ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
