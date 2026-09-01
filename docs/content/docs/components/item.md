---
title: item
category: 'layout'
description: >
  Flexible list item primitive
---

Items compose media, content, title, description, and actions.

```html
<div data-slot="item" variant="outline">
  <div data-slot="item-content">
    <div data-slot="item-title">Item title</div>
    <p data-slot="item-description">Supporting description.</p>
  </div>
</div>
```

## Example

{{< example src="examples/components/item.html" title="Item example" height="360" >}}

## Workflows

{{< example src="examples/components/item-workflows.html" title="Item workflows" height="3900" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This is a styling-only HTML element or pattern. AngularCSS registers no runtime directive for it. An item is a styled semantic HTML composition with authored state.

## Anatomy

### Root styling selector

- `data-slot="item"`

### Styling slots

- `[data-slot="item"]`
- `[data-slot="item-actions"]`
- `[data-slot="item-content"]`
- `[data-slot="item-description"]`
- `[data-slot="item-footer"]`
- `[data-slot="item-group"]`
- `[data-slot="item-header"]`
- `[data-slot="item-media"]`
- `[data-slot="item-separator"]`
- `[data-slot="item-title"]`
- `[data-slot="spinner"]`

Slots are optional unless the usage example or behavior description identifies a required relationship.
Use the named slots as stable Tailwind and CSS selectors.

## API

### Attributes and state

This component has no directive-specific attributes beyond its semantic HTML.

Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state.

### CSS custom properties

This styling hook does not define component-specific CSS custom properties.

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

Target semantic elements, styling slots, native state selectors, and authored ARIA attributes from Tailwind or ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
