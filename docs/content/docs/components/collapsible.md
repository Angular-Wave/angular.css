---
title: collapsible
category: 'disclosure'
description: >
  HTML-first disclosure state and trigger/panel relationships
---

Prefer native `details` and `summary` when the whole region can collapse. They
own click and keyboard behavior; AngularCSS only reflects state and connects the
trigger to its panel. Use a native button trigger for compositions that keep
sibling content visible while one panel collapses. AngularTS owns any controlled
application model.

```html
<details ng-collapsible>
  <summary data-slot="collapsible-trigger">Order details</summary>
  <div data-slot="collapsible-content">Shipping address and item details.</div>
</details>
```

## Example

{{< example src="examples/components/collapsible.html" title="Order details" height="360" >}}

## Basic, settings, and RTL

{{< example src="examples/components/collapsible-workflows.html" title="Collapsible reference workflows" height="900" >}}

## File tree

{{< example src="examples/components/collapsible-compositions.html" title="Nested collapsible file tree" height="720" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This component's root directive is `[ng-collapsible]`. Importing the package registers it with the AngularCSS `ui` module; there is no per-component JavaScript registration step.

## Anatomy

### Directive selectors

- `ng-collapsible`
- `ng-collapsible-content`
- `ng-collapsible-trigger`

### Styling slots

- `[data-slot="collapsible"]`
- `[data-slot="collapsible-content"]`
- `[data-slot="collapsible-trigger"]`

A trigger and content panel are required. Prefer direct `summary` and panel children of native `details`; use a native button trigger only when the composition cannot be represented by `details`.
Use the named slots as stable Tailwind and CSS selectors.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-controls` | Output | ARIA relationship or state. |
| `aria-expanded` | Output | Open or expanded state exposed to assistive technology. |
| `aria-labelledby` | Input/output | ARIA relationship or state. |
| `data-open` | Input | Stable component state or styling hook. |
| `data-state` | Output | Stable component state or styling hook. |
| `open` | Input | Initial or controlled open state. |

`Input` attributes are read from authored HTML. `Output` attributes are maintained by AngularCSS for CSS and testing. `Input/output` attributes may be authored for a controlled initial state and are then synchronized by the directive.

### CSS custom properties

This directive does not write component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

Native `details` and `summary` own disclosure behavior whenever the composition permits it. The directive reflects native open state and supplies trigger/panel relationships. For compositions with persistent siblings, a native button can trigger one panel while AngularTS remains responsible for any controlled application model.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Triggers and panels are connected with `aria-controls` and `aria-labelledby`. Expanded and hidden state is synchronized as the disclosure changes.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target `[ng-collapsible]`, the documented `data-slot` selectors, and generated `data-*` states from Tailwind or ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
