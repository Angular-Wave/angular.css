---
title: button
category: 'action'
description: >
  Action controls with `variant` and `size` styling hooks.
---

Use `ng-button` directly on `button` (or `input[type="button"]`) elements and
set `variant`/`size` attributes for variants and spacing.

```html
<div class="row">
  <button ng-button>Default</button>
  <button ng-button variant="outline">Outline</button>
  <button ng-button size="sm">Small</button>
</div>
```

## Example

{{< example src="examples/components/button.html" title="Button examples" height="260" >}}

## Variant workflows

{{< example src="examples/components/button-workflows.html" title="Button variants, sizes, loading, and RTL" height="480" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This component's root directive is `[ng-button]`. Importing the package registers it with the AngularCSS `ui` module; there is no per-component JavaScript registration step.

## Anatomy

### Directive selectors

- `ng-button`

### Styling slots

- `[data-slot="button"]`

Slots are optional unless the usage example or behavior description identifies a required relationship.
Use the named slots as stable Tailwind and CSS selectors.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-disabled` | Input/output | Semantic disabled state. |
| `data-disabled` | Output | Stable component state or styling hook. |
| `data-size` | Input/output | Stable component state or styling hook. |
| `data-variant` | Input/output | Stable component state or styling hook. |
| `size` | Input | Visual size token supported by the component stylesheet. |
| `tabindex` | Output | Keyboard focus order for composite descendants. |
| `type` | Input/output | Component or native behavior variant. |
| `variant` | Input | Visual variant token supported by the component stylesheet. |

`Input` attributes are read from authored HTML. `Output` attributes are maintained by AngularCSS for CSS and testing. `Input/output` attributes may be authored for a controlled initial state and are then synchronized by the directive.

### CSS custom properties

This directive does not write component-specific CSS custom properties.

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

Target `[ng-button]`, the documented `data-slot` selectors, and generated `data-*` states from Tailwind or ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
