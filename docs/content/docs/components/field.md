---
title: field
category: 'form'
description: >
  Group labels, helper text, and errors with semantic field wrapper selectors.
---

Use the field wrapper and field parts to define standard form structure.

```html
<div class="field">
  <label for="email">Email</label>
  <input id="email" type="email" placeholder="Email" class="input" />
  <p>Use your work email.</p>
</div>

<div class="field">
  <label for="invalid-email">Email</label>
  <input id="invalid-email" aria-invalid="true" class="input" />
  <p class="field-error">Enter a valid email.</p>
</div>
```

## Example

{{< example src="examples/components/field.html" title="Field example" height="300" >}}

## Workflows

{{< example src="examples/components/field-workflows.html" title="Field workflows" height="2500" >}}

## Validation States

Fields derive presentation from native validity and `aria-invalid`; AngularTS
structural directives may insert or remove controls and descriptions.

{{< example src="examples/components/field-state-workflows.html" title="Field validation and conditional controls" height="760" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This is a styling-only HTML element or pattern. AngularCSS registers no runtime directive for it. Native labels, descriptions, validation, and AngularTS forms provide the contract.

## Anatomy

### Root styling selector

- `.field`

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

Field is a styling-only semantic form composition. Native labels, validation, and `aria-describedby` own relationships; AngularTS forms and structural directives own model, error visibility, and submission state.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Connect every control to a native label. Give descriptions and errors stable IDs and author `aria-describedby` on the control. Use native `fieldset` and `legend` only for actual groups of related controls.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, native state selectors, and component classes from Tailwind or ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
