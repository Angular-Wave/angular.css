---
title: native-select
category: 'form'
description: >
  Native `<select>` wrapper and state syncing without custom JavaScript
  behavior.
---

Use `ng-native-select` directly on select controls and style via `data-slot`
selectors.

```html
<div data-slot="native-select-wrapper">
  <select ng-native-select aria-label="Status">
    <option value="">Select status</option>
    <option value="todo">Todo</option>
  </select>
</div>
```

## Example

{{< example src="examples/components/native-select.html" title="Native select example" height="220" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This is a styling-only HTML element or pattern. AngularCSS registers no runtime directive for it. Native select behavior, validation, and AngularTS models provide the contract.

## Anatomy

### Root styling selector

- `data-slot="native-select"`

### Styling slots

- `[data-slot="native-select"]`
- `[data-slot="native-select-icon"]`
- `[data-slot="native-select-optgroup"]`
- `[data-slot="native-select-option"]`
- `[data-slot="native-select-wrapper"]`

Apply `ng-native-select` directly to a native `select` inside the wrapper slot. Native `option` and `optgroup` elements need no additional attributes. The icon slot is optional because the wrapper supplies a CSS chevron fallback.
Use the named slots as stable Tailwind and CSS selectors.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-invalid` | Input | Validation state mirrored from the control. |
| `data-size` | Input | Stable component state or styling hook. |
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

The native `select` owns value selection, keyboard interaction, option groups, disabled behavior, validation, and form submission. AngularTS `ng-model` remains the application source of truth. The directive only mirrors native value, empty, required, disabled, and invalid state into stable `data-*` hooks.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Use a visible `label` connected by `for` and `id`, or provide another accessible name when the surrounding composition already labels the control. Native option, optgroup, disabled, required, invalid, and direction semantics are preserved rather than recreated.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, styling slots, native state selectors, and authored ARIA attributes from Tailwind or ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
