---
title: alert
category: 'feedback'
description: >
  Compact feedback blocks for status and context.
---

Use `section.alert` for important feedback blocks. The default presentation is
neutral; add `variant="destructive"` for destructive feedback or apply Tailwind
classes and design tokens for application-specific colors.

```html
<section class="alert">
  <svg aria-hidden="true"><!-- optional icon --></svg>
  <h2>Saved!</h2>
  <p>Your profile was updated.</p>
  <div>
    <button ng-click="dismiss()" class="button">Dismiss</button>
  </div>
</section>
```

## Example

{{< example src="examples/components/alert.html" title="Alert examples" height="300" >}}

## Variants And Composition

{{< example src="examples/components/alert-workflows.html" title="Alert variants and composition" height="792" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This is a styling-only HTML element or pattern. AngularCSS registers no runtime directive for it. Authored alert semantics and CSS provide the complete contract.

## Anatomy

### Root styling selector

- `.alert`

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

The directive exposes presentation and announcement state. The application decides when feedback appears, changes, or is removed.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Use the appropriate live-region or status semantics for dynamic feedback. Decorative feedback must stay hidden from assistive technology.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, native state selectors, and component classes from Tailwind or ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
