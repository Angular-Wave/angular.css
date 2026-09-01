---
title: direction
category: 'utility'
description: >
  Direction and logical text helpers for mixed-locale interfaces.
---

Use `ng-direction` to mirror the `dir` value into `data-direction` and inline
`direction` for nested semantic blocks.

```html
<section ng-direction dir="rtl">
  <p data-logical-align="start">Logical start aligns for right-to-left.</p>
</section>
```

## Example

{{< example src="examples/components/direction.html" title="Direction examples" height="340" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This is a styling-only HTML element or pattern. AngularCSS registers no runtime directive for it. The native dir attribute and CSS logical properties provide the contract.

## Anatomy

### Root styling selector

- `data-slot="direction"`

### Styling slots

- `[data-slot="direction"]`
- `[data-slot="rtl-flip"]`

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

The directive mirrors a platform-level value into stable styling hooks without creating a separate application model.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

The authored direction and language remain the semantic source of truth. Mirrored attributes are styling hooks, not replacement semantics.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, styling slots, native state selectors, and authored ARIA attributes from Tailwind or ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
