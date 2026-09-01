---
title: card
category: 'layout'
description: >
  Sectioned content container using semantic slots.
---

Use `ng-card` on a wrapper and optional child slots for header, content, footer,
and action.

```html
<section ng-card>
  <header data-slot="card-header">
    <h3 data-slot="card-title">Title</h3>
    <p data-slot="card-description">Optional description</p>
    <div data-slot="card-action">Action</div>
  </header>
  <div data-slot="card-content">Content</div>
  <footer data-slot="card-footer">Footer</footer>
</section>
```

## Example

{{< example src="examples/components/card.html" title="Card example" height="500" >}}

## Image And RTL

Card content remains ordinary semantic HTML. Use local images, logical CSS
properties, and AngularTS form or command directives for application state.

{{< example src="examples/components/card-workflows.html" title="Card image, small, and RTL compositions" height="1500" >}}

## Section States

Card sections are optional. The directive exposes their presence and normalizes
the compact size without adding application state.

{{< example src="examples/components/card-state-workflows.html" title="Card section and size states" height="700" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This is a styling-only HTML element or pattern. AngularCSS registers no runtime directive for it. A card is a styled semantic HTML composition without runtime behavior.

## Anatomy

### Root styling selector

- `data-slot="card"`

### Styling slots

- `[data-slot="card"]`
- `[data-slot="card-action"]`
- `[data-slot="card-content"]`
- `[data-slot="card-description"]`
- `[data-slot="card-footer"]`
- `[data-slot="card-header"]`
- `[data-slot="card-title"]`

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
