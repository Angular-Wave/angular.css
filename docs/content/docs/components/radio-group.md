---
title: radio-group
category: 'form'
description: >
  Native radio input grouping with role and focus behavior.
---

Attach `ng-radio-group` to a wrapper element and use `ng-radio-group-item` on
each native radio input.

```html
<div ng-radio-group role="radiogroup">
  <div ng-field orientation="horizontal">
    <input
      ng-radio-group-item
      id="default"
      name="density"
      type="radio"
      value="default"
    />
    <label ng-label for="default">Default</label>
  </div>
</div>
```

## Example

{{< example src="examples/components/radio-group.html" title="Radio group example" height="240" >}}

## Reference Workflows

{{< example src="examples/components/radio-group-workflows.html" title="Radio group workflows" height="1320" >}}

## Field Compositions

{{< example src="examples/components/radio-fields.html" title="Radio fields" height="1180" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This is a styling-only HTML element or pattern. AngularCSS registers no runtime directive for it. Native radio groups own selection, keyboard behavior, and validation.

## Anatomy

### Root styling selector

- `data-slot="radio-group"`

### Styling slots

- `[data-slot="radio-group"]`
- `[data-slot="radio-group-item"]`

Place native `input type="radio"` controls inside the group and give related controls the same `name`. Compose labels, descriptions, and validation with native fieldsets and existing Field primitives. Use either `ng-radio-group-*` selectors or `data-slot` hooks on each element; do not duplicate both.
Use the named slots as stable Tailwind and CSS selectors.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-invalid` | Input | Validation state mirrored from the control. |
| `checked` | Input | Initial native checked state. |
| `dir` | Input | Text and interaction direction: `ltr` or `rtl`. |
| `disabled` | Input | Disables native or component interaction. |
| `name` | Input | Authored option or semantic HTML attribute observed by the directive. |
| `required` | Input | Marks a native form value as required. |
| `value` | Input | Native value or authored component value. |

Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state.

### CSS custom properties

This styling hook does not define component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

Native radio inputs own selection, arrow-key behavior, disabled state, validation, and form submission. AngularTS `ng-model` remains the application source of truth. The directive only groups the controls and mirrors native checked state into stable `aria-checked` and `data-state` hooks, including radios inserted by structural bindings.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Use native radio inputs with a shared `name` and an explicit label for every control. Use `fieldset` and `legend` for a visible group label when appropriate. Preserve native disabled and invalid semantics, and connect supporting descriptions with `aria-describedby`.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, styling slots, native state selectors, and authored ARIA attributes from Tailwind or ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
