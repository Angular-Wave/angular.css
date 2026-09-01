---
title: input-otp
category: 'form'
description: >
  Multi-digit OTP inputs with automatic focus movement and paste handling.
---

Use `ng-input-otp` on a fieldset containing grouped `.input-otp-slot` inputs.

```html
<fieldset ng-input-otp class="input-otp">
  <div class="input-otp-group">
    <span class="input-otp-slot">
    <input />
    </span>
  </div>
</fieldset>
```

## Example

{{< example src="examples/components/input-otp.html" title="Input OTP example" height="220" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This component's root directive is `[ng-input-otp]`. Importing the package registers it with the AngularCSS `ui` module; there is no per-component JavaScript registration step.

## Anatomy

### Directive selectors

- `ng-input-otp`

### Semantic structure

Use native elements for authored structure. Component classes are optional visual hooks when an HTML relationship is not specific enough.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-invalid` | Input | Validation state mirrored from the control. |
| `aria-label` | Input/output | Accessible name when visible text is insufficient. |
| `autocomplete` | Output | Authored option or semantic HTML attribute observed by the directive. |
| `data-active` | Output | Stable component state or styling hook. |
| `data-complete` | Output | Stable component state or styling hook. |
| `data-disabled` | Output | Stable component state or styling hook. |
| `data-invalid` | Output | Stable component state or styling hook. |
| `data-value` | Output | Stable component state or styling hook. |
| `inputmode` | Input/output | Authored option or semantic HTML attribute observed by the directive. |
| `maxlength` | Input/output | Authored option or semantic HTML attribute observed by the directive. |

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

Target `[ng-input-otp]`, semantic descendants, component classes, and generated state from Tailwind or ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
