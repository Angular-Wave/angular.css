---
title: range
category: "form"
description: >
  A styled native range input with browser-owned interaction and AngularTS model binding.
---

Use a native range input directly. AngularCSS adds presentation but registers no
directive.

```html
<label for="volume">Volume</label>
<input id="volume" type="range" min="0" max="100" ng-model="volume" />
<output for="volume">{{ volume }}</output>
```

## Example

{{< example src="examples/components/range.html" title="Range example" height="220" >}}

<!-- angularcss-reference:start -->
## Installation

Load the AngularCSS stylesheet. This entry needs no AngularCSS JavaScript or `angular.css` module dependency. Add AngularTS when using application bindings such as `ng-model` or `ng-click`. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This entry uses native HTML and CSS. AngularCSS registers no runtime directive for it. Native range input behavior and styling.

## Anatomy

### Root styling selector

- `input[type="range"]`

### Semantic structure

Use semantic HTML with the root styling selector above. Native elements provide the structure; the stylesheet supplies presentation.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `disabled` | Authored | Disables native or component interaction. |
| `max` | Authored | Maximum native or component value. |
| `min` | Authored | Minimum native or component value. |
| `orientation` | Authored | Layout direction: `horizontal` or `vertical`. |
| `step` | Authored | Native numeric step interval. |
| `value` | Authored | Native value or authored component value. |

Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state.

### CSS custom properties

This styling hook does not define component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

Native range input behavior and styling. AngularCSS supplies styling without a runtime directive. Native HTML owns platform behavior; AngularTS owns application values, commands, and authored state.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Associate every control with a visible label. Preserve native required, disabled, and invalid semantics, and connect help or error text with `aria-describedby`.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, native state selectors, and component classes with ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Customization]({{< relref
"/docs/get-started/customization" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
