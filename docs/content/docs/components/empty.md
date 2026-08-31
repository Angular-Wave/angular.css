---
title: empty
category: 'layout'
description: >
  Empty state layout
---

Empty states compose media, title, description, and action content slots.

```html
<section ng-empty>
  <div data-slot="empty-header">
    <div data-slot="empty-media" variant="icon"></div>
    <h3 data-slot="empty-title">No projects yet</h3>
    <p data-slot="empty-description">Create your first project.</p>
  </div>
</section>
```

## Example

{{< example src="examples/components/empty.html" title="Empty example" height="340" >}}

## Workflows

{{< example src="examples/components/empty-workflows.html" title="Empty state workflows" height="1900" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This component's root directive is `[ng-empty]`. Importing the package registers it with the AngularCSS `ui` module; there is no per-component JavaScript registration step.

## Anatomy

### Directive selectors

- `ng-empty`

### Styling slots

- `[data-slot="empty"]`
- `[data-slot="empty-content"]`
- `[data-slot="empty-description"]`
- `[data-slot="empty-header"]`
- `[data-slot="empty-icon"]`
- `[data-slot="empty-media"]`
- `[data-slot="empty-title"]`
- `[data-slot="spinner"]`

Slots are optional unless the usage example or behavior description identifies a required relationship.
Use the named slots as stable Tailwind and CSS selectors.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-live` | Input/output | ARIA relationship or state. |
| `role` | Input/output | Explicit semantic role when native HTML does not provide one. |

`Input` attributes are read from authored HTML. `Output` attributes are maintained by AngularCSS for CSS and testing. `Input/output` attributes may be authored for a controlled initial state and are then synchronized by the directive.

### CSS custom properties

This directive does not write component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

The component owns layout-specific DOM relationships and CSS state only. Content, persistence, routing, and application state remain with the application.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Prefer semantic landmarks and native elements inside the layout. Any interactive handles or triggers must retain an accessible name and visible focus indicator.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target `[ng-empty]`, the documented `data-slot` selectors, and generated `data-*` states from Tailwind or ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
