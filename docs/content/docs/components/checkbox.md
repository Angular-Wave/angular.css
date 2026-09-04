---
title: checkbox
category: 'form'
description: >
  Native checkbox control styled from native state.
---

Use `class="checkbox"` on a native checkbox input. Native input state and
AngularTS `ng-model` remain the source of truth.

```html
<div orientation="horizontal" class="field">
  <input
    id="terms"
    name="terms"
    type="checkbox"
    ng-model="terms"
    class="checkbox"
  />
  <label for="terms"> Accept terms </label>
</div>
```

Set the native `HTMLInputElement.indeterminate` property from application code
when a mixed selection is needed. Native `:indeterminate` state owns both the
visual and accessibility contract; AngularCSS does not create a second checkbox
model.

## Example

{{< example src="examples/components/checkbox.html" title="Checkbox example" height="420" >}}

## States, group, and RTL

{{< example src="examples/components/checkbox-workflows.html" title="Checkbox reference workflows" height="1200" >}}

## Table selection

{{< example src="examples/components/checkbox-compositions.html" title="Checkbox table composition" height="420" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This is a styling-only HTML element or pattern. AngularCSS registers no runtime directive for it. Native checkbox state and CSS pseudo-classes provide the complete contract.

## Anatomy

### Root styling selector

- `.checkbox`

### Semantic structure

Use native elements for authored structure. Component classes are optional visual hooks when an HTML relationship is not specific enough.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `checked` | Input | Initial native checked state. |
| `disabled` | Input | Disables native or component interaction. |
| `required` | Input | Marks a native form value as required. |

Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state.

### CSS custom properties

This styling hook does not define component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

Native form state and AngularTS `ng-model`, validation, and submission remain the source of truth. AngularCSS mirrors that state into stable styling and accessibility hooks.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Associate every control with a visible label. Native required, disabled, and invalid semantics are preserved and mirrored rather than replaced.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, native state selectors, and component classes from Tailwind or ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
