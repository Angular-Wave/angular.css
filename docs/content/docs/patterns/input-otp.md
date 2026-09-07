---
title: input-otp
category: 'form'
description: >
  A native one-time-code input with a segmented visual treatment.
---

Use one native input. The browser owns editing, paste, autofill, and validation.

```html
<label for="code">One-time code</label>
<input
  id="code"
  class="input-otp"
  autocomplete="one-time-code"
  inputmode="numeric"
  pattern="[0-9]{6}"
  maxlength="6"
  ng-model="code"
/>
```

## Example

{{< example src="examples/components/input-otp.html" title="Input OTP example" height="220" >}}

<!-- angularcss-reference:start -->
## Installation

Load the AngularCSS stylesheet. This entry needs no AngularCSS JavaScript or `angular.css` module dependency. Add AngularTS when using application bindings such as `ng-model` or `ng-click`. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This entry uses native HTML and CSS. AngularCSS registers no runtime directive for it. One native one-time-code input.

## Anatomy

### Root styling selector

- `.input-otp`

### Semantic structure

Use semantic HTML with the root styling selector above. Native elements provide the structure; the stylesheet supplies presentation.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-invalid` | Authored | Validation state exposed to assistive technology and CSS. |
| `maxlength` | Authored | Maximum native text length. |
| `pattern` | Authored | Native regular-expression validation constraint. |
| `size` | Authored | Visual size token supported by the component stylesheet. |

Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state.

### CSS custom properties

| Variable | Purpose |
| --- | --- |
| `--otp-cell-size` | Width of one visual code cell; defaults to ten spacing units. |

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

Input OTP is one styling-only native `input`. The browser owns typing, editing, paste, password-manager autofill, `autocomplete=one-time-code`, input mode, length, pattern validation, and form submission; AngularTS `ng-model` owns application state. AngularCSS registers no input-otp directive.

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
