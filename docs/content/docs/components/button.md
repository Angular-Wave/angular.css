---
title: button
category: 'action'
description: >
  Action controls with `variant` and `size` styling hooks.
---

Use `class="button"` directly on native buttons, button inputs, or links and set
`variant`/`size` attributes for variants and spacing.

```html
<div class="row">
  <button class="button">Default</button>
  <button variant="outline" class="button">Outline</button>
  <button size="sm" class="button">Small</button>
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

This is a styling-only HTML element or pattern. AngularCSS registers no runtime directive for it. Native buttons and links own semantics, state, and activation.

## Anatomy

### Root styling selector

- `.button`

### Semantic structure

Use native elements for authored structure. Component classes are optional visual hooks when an HTML relationship is not specific enough.

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

The directive mirrors interaction state for styling and supplies only the keyboard behavior required by the component contract. Application commands and business state remain in AngularTS expressions.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Use a native `button` whenever the control performs an action. Keep an accessible name, preserve visible focus, and use `disabled` for unavailable native controls.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, native state selectors, and component classes from Tailwind or ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
