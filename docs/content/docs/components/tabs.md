---
title: tabs
category: 'navigation'
description: >
  Tabbed content sections
---

Use ARIA tab roles and slot attributes. Set active triggers with
`aria-selected="true"` or `data-active="true"`.

```html
<div data-slot="tabs">
  <div data-slot="tabs-list" role="tablist">
    <button data-slot="tabs-trigger" role="tab" aria-selected="true">
      Overview
    </button>
  </div>
  <div data-slot="tabs-content" role="tabpanel">Content</div>
</div>
```

## Example

{{< example src="examples/components/tabs.html" title="Tabs example" height="330" >}}

## Workflows

{{< example src="examples/components/tabs-workflows.html" title="Tabs state and layout workflows" height="1080" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This component's root directive is `[ng-tabs]`. Importing the package registers it with the AngularCSS `ui` module; there is no per-component JavaScript registration step.

## Anatomy

### Directive selectors

- `ng-tabs`
- `ng-tabs-content`
- `ng-tabs-list`
- `ng-tabs-trigger`

### Styling slots

- `[data-slot="tabs"]`
- `[data-slot="tabs-content"]`
- `[data-slot="tabs-list"]`
- `[data-slot="tabs-trigger"]`

Slots are optional unless the usage example or behavior description identifies a required relationship.
Use the named slots as stable Tailwind and CSS selectors.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-disabled` | Input | Semantic disabled state. |
| `aria-orientation` | Input | ARIA relationship or state. |
| `aria-selected` | Input | Selected item state. |
| `data-active` | Input | Stable component state or styling hook. |
| `dir` | Input | Text and interaction direction: `ltr` or `rtl`. |
| `disabled` | Input | Disables native or component interaction. |
| `orientation` | Input | Layout direction: `horizontal` or `vertical`. |
| `role` | Input | Explicit semantic role when native HTML does not provide one. |

`Input` attributes are read from authored HTML. `Output` attributes are maintained by AngularCSS for CSS and testing. `Input/output` attributes may be authored for a controlled initial state and are then synchronized by the directive.

### CSS custom properties

This directive does not write component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

The directive supplies navigation semantics and keyboard state where required. URLs, routing, current-page state, and navigation side effects remain application-owned.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Use semantic navigation landmarks and links. Expose the current destination with `aria-current` and keep keyboard order consistent with visual order.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target `[ng-tabs]`, the documented `data-slot` selectors, and generated `data-*` states from Tailwind or ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
