---
title: select
category: 'form'
description: >
  Native select styling integrated with AngularTS models and form state.
---

Apply `.select` to a native `select`. Use an optional `.select-wrapper` for the
packaged chevron, and bind application state with AngularTS `ng-model`.

```html
<div class="select-wrapper">
  <select id="status" class="select" ng-model="status" required>
    <option value="">Select a status</option>
    <option>Todo</option>
    <option>Done</option>
  </select>
</div>
```

## Example

{{< example src="examples/components/select.html" title="Select example" height="400" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This is a styling-only HTML element or pattern. AngularCSS registers no runtime directive for it. Native select owns values, option groups, validation, keyboard behavior, and AngularTS models.

## Anatomy

### Root styling selector

- `.select`

### Semantic structure

Apply `.select` directly to a native `select` inside an optional `.select-wrapper`. Native `option` and `optgroup` elements need no additional attributes. Use AngularTS `ng-model`, validators, and form directives directly on the select.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-invalid` | Input | Validation state mirrored from the control. |
| `dir` | Input | Text and interaction direction: `ltr` or `rtl`. |
| `disabled` | Input | Disables native or component interaction. |
| `multiple` | Input | Allows more than one item to remain selected or open. |
| `name` | Input | Authored option or semantic HTML attribute observed by the directive. |
| `required` | Input | Marks a native form value as required. |

Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state.

### CSS custom properties

This styling hook does not define component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

The native `select` owns values, option groups, keyboard interaction, disabled state, validation, and form submission. AngularTS supplies option registration, `ng-model`, validators, and form-state classes. AngularCSS registers no select directive.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Use a visible `label` connected by `for` and `id`, or provide another accessible name. Preserve native option, optgroup, multiple, disabled, required, invalid, and direction semantics; AngularTS reflects model and validation state without replacing them.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, native state selectors, and component classes from Tailwind or ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
