---
title: slider
category: 'form'
description: >
  Range input with accessible slider state synced for styling hooks.
---

Use `ng-slider` with native range inputs. The directive exposes `aria-*` value
attributes and a computed `data-value`. For range and multiple-value surfaces,
put native range inputs directly inside a container marked with `ng-slider`. The
parent inspects each input, renders the shared track itself, and leaves every
input's AngularTS `ng-model` and native form behavior intact.

```html
<label for="volume">Volume</label>
<input ng-slider id="volume" type="range" min="0" max="100" />
```

## Example

{{< example src="examples/components/slider.html" title="Slider example" height="220" >}}

## Reference workflows

The workflow page covers controlled and multi-thumb ranges, disabled state,
right-to-left direction, and vertical orientation. Every thumb uses the same
absolute bounds so its native position remains accurate. Applications that
require ordered or non-crossing values enforce that policy in AngularTS state.

{{< example src="examples/components/slider-workflows.html" title="Slider reference workflows" height="720" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This component's root directive is `[ng-slider]`. Importing the package registers it with the AngularCSS `ui` module; there is no per-component JavaScript registration step.

## Anatomy

### Directive selectors

- `ng-slider`

### Semantic structure

Use native elements for authored structure. Component classes are optional visual hooks when an HTML relationship is not specific enough.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-orientation` | Output | ARIA relationship or state. |
| `dir` | Input | Text and interaction direction: `ltr` or `rtl`. |
| `max` | Input | Maximum native or component value. |
| `min` | Input | Minimum native or component value. |
| `orientation` | Input/output | Layout direction: `horizontal` or `vertical`. |

`Input` attributes are read from authored HTML. `Output` attributes are maintained by AngularCSS for CSS and testing. `Input/output` attributes may be authored for a controlled initial state and are then synchronized by the directive.

### CSS custom properties

- `--range-end`
- `--range-start`
- `--value`

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

Target `[ng-slider]`, semantic descendants, component classes, and generated state from Tailwind or ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
