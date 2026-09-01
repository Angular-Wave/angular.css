---
title: progress
category: 'feedback'
description: >
  Task completion indicator
---

Use native `progress` or a slot-based progress wrapper when you need a label and
value display.

```html
<div ng-progress value="56" max="100">
  <span ng-progress-label>Upload progress</span>
  <span ng-progress-value></span>
  <span ng-progress-track>
    <span ng-progress-indicator></span>
  </span>
</div>
```

## Example

{{< example src="examples/components/progress.html" title="Progress example" height="190" >}}

## Controlled and RTL

{{< example src="examples/components/progress-workflows.html" title="Progress workflows" height="300" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This is a styling-only HTML element or pattern. AngularCSS registers no runtime directive for it. Native progress or authored progressbar semantics and CSS variables are sufficient.

## Anatomy

### Root styling selector

- `data-slot="progress"`

### Styling slots

- `[data-slot="progress"]`
- `[data-slot="progress-indicator"]`
- `[data-slot="progress-label"]`
- `[data-slot="progress-track"]`
- `[data-slot="progress-value"]`

The root may contain optional label and value slots followed by one track containing one indicator. Use `data-value-format="custom"` on the value slot when application-authored localized text must be preserved. Use either `ng-progress-*` selectors or `data-slot` hooks on each element; do not duplicate both.
Use the named slots as stable Tailwind and CSS selectors.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `data-value-format` | Input | Set to `custom` to preserve application-authored value text. |
| `dir` | Input | Text and interaction direction: `ltr` or `rtl`. |
| `max` | Input | Maximum native or component value. |
| `value` | Input | Native value or authored component value. |

Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state.

### CSS custom properties

This styling hook does not define component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

The directive synchronizes authored `value` and `max` attributes into progressbar ARIA state, `data-value`, the `--value` CSS property, and standard label/value slots. AngularTS models, native form controls, timers, and application workflows remain the source of truth for when and how progress changes.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Give every progressbar an accessible name. A progress label slot is connected automatically unless the root already has `aria-label` or an authored `aria-labelledby`. Determinate values expose `aria-valuenow`; omit `value` for indeterminate progress.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, styling slots, native state selectors, and authored ARIA attributes from Tailwind or ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
