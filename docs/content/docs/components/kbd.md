---
title: kbd
category: 'text'
description: >
  Keyboard shortcut hint
---

Use native `kbd` elements with `data-slot="kbd"`. Group shortcuts with
`data-slot="kbd-group"`.

```html
<span data-slot="kbd-group">
  <kbd data-slot="kbd">Ctrl</kbd>
  <kbd data-slot="kbd">K</kbd>
</span>
```

## Example

{{< example src="examples/components/kbd.html" title="Kbd example" height="150" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This is a styling-only HTML element or pattern. AngularCSS registers no runtime directive for it. The native kbd element already provides the required semantics.

## Anatomy

### Root styling selector

- `data-slot="kbd"`

### Styling slots

- `[data-slot="kbd"]`
- `[data-slot="kbd-group"]`

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

This component is primarily semantic HTML with styling hooks and does not introduce application state.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Keep the text available to assistive technology and add an accessible label when a visual abbreviation would otherwise be ambiguous.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, styling slots, native state selectors, and authored ARIA attributes from Tailwind or ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
