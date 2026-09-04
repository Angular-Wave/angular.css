---
title: input
category: 'form'
description: >
  Native form text entry with a styling-only AngularCSS hook.
---

Use `class="input"` as the opt-in styling hook. The browser and AngularTS own
the value, events, validation, required state, disabled state, and form
behavior; AngularCSS does not register an Input directive or mirror those
values.

```html
<input placeholder="Jane Doe" class="input" />
<input placeholder="Disabled" disabled class="input" />
```

Add `input-fit` when a compact control should size to its content. The control
retains a `max-width` of `100%` and falls back to its native intrinsic width in
browsers without `field-sizing`.

```html
<input value="Compact" class="input input-fit" />
```

## Example

{{< example src="examples/components/input.html" title="Input examples" height="220" >}}

## Workflows

{{< example src="examples/components/input-workflows.html" title="Input workflows" height="1900" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This is a styling-only HTML element or pattern. AngularCSS registers no runtime directive for it. Native input behavior, validation, and AngularTS models provide the contract.

## Anatomy

### Root styling selector

- `.input`

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

Input is a styling-only native control selected by `.input`. AngularTS and the browser own value, events, model synchronization, validation, disabled and required state, and form submission. AngularCSS registers no input directive.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Use a native input with a visible label. Preserve native type, name, autocomplete, required, disabled, and validation semantics; use AngularTS `ng-model` for application state and `aria-invalid` when application validation must be exposed explicitly.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, native state selectors, and component classes from Tailwind or ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
