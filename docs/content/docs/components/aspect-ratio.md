---
title: aspect-ratio
category: 'layout'
description: >
  Fixed-ratio media wrapper
---

Set `ratio` on `ng-aspect-ratio`, or set `--ratio` directly when only the
styling slot is needed. Media positioning and cropping remain application-owned.

```html
<div ng-aspect-ratio ratio="16 / 9">
  <img
    src="photo.jpg"
    alt="Photo"
    class="absolute inset-0 size-full object-cover"
  />
</div>
```

## Example

{{< example src="examples/components/aspect-ratio.html" title="Aspect ratio example" height="320" >}}

## Ratios And Direction

{{< example src="examples/components/aspect-ratio-workflows.html" title="Aspect ratio variants" height="816" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This is a styling-only HTML element or pattern. AngularCSS registers no runtime directive for it. CSS aspect-ratio provides the complete layout behavior.

## Anatomy

### Root styling selector

- `data-slot="aspect-ratio"`

### Styling slots

- `[data-slot="aspect-ratio"]`

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
