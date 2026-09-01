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

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This is a styling-only HTML element or pattern. AngularCSS registers no runtime directive for it. One native input provides text entry, paste, autofill, validation, and AngularTS model binding.

## Anatomy

### Root styling selector

- `.input-otp`

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

Input OTP is one styling-only native `input`. The browser owns typing, editing, paste, password-manager autofill, `autocomplete=one-time-code`, input mode, length, pattern validation, and form submission; AngularTS `ng-model` owns application state. AngularCSS registers no input-otp directive.

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
