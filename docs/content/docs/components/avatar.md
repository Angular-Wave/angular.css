---
title: avatar
category: 'media'
description: >
  User avatar, fallback, badge, and group primitives.
---

Use `ng-avatar` with optional `avatar-image`, `avatar-fallback`, and
`avatar-badge`, or wrap multiple avatars with `ng-avatar-group`.

```html
<span ng-avatar>
  <span data-slot="avatar-fallback">JD</span>
  <span data-slot="avatar-badge"></span>
</span>

<span data-slot="avatar-group">
  <span ng-avatar><span data-slot="avatar-fallback">AB</span></span>
  <span data-slot="avatar-group-count">+3</span>
</span>
```

## Example

{{< example src="examples/components/avatar.html" title="Avatar example" height="180" >}}

## Variants And Composition

Use `size="sm"`, the default size, or `size="lg"`. Badge icons, grouped counts,
RTL layouts, and dropdown triggers compose from the same semantic slots without
changing Avatar behavior.

{{< example src="examples/components/avatar-workflows.html" title="Avatar variants and composition" height="620" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This component's root directive is `[ng-avatar]`. Importing the package registers it with the AngularCSS `ui` module; there is no per-component JavaScript registration step.

## Anatomy

### Directive selectors

- `ng-avatar`
- `ng-avatar-fallback`
- `ng-avatar-image`

### Styling slots

- `[data-slot="avatar"]`
- `[data-slot="avatar-badge"]`
- `[data-slot="avatar-fallback"]`
- `[data-slot="avatar-group"]`
- `[data-slot="avatar-group-count"]`
- `[data-slot="avatar-image"]`

Slots are optional unless the usage example or behavior description identifies a required relationship.
Use the named slots as stable Tailwind and CSS selectors.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `data-size` | Input/output | Stable component state or styling hook. |
| `data-state` | Output | Stable component state or styling hook. |
| `size` | Input | Visual size token supported by the component stylesheet. |

`Input` attributes are read from authored HTML. `Output` attributes are maintained by AngularCSS for CSS and testing. `Input/output` attributes may be authored for a controlled initial state and are then synchronized by the directive.

### CSS custom properties

This directive does not write component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

The directive reflects media loading and fallback state. The application remains responsible for the source URL, alternative text, and content lifecycle.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Provide useful alternative text for meaningful media. Mark decorative media as hidden and ensure fallback content communicates the same identity.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target `[ng-avatar]`, the documented `data-slot` selectors, and generated `data-*` states from Tailwind or ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
