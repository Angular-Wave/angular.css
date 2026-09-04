---
title: input-otp
notoc: true
description: >
  Native one-time password input
---

Use one native input. The browser owns editing, paste, autofill, validation, and
focus while AngularTS `ng-model` owns application state.

```html
<input
  class="input-otp"
  inputmode="numeric"
  autocomplete="one-time-code"
  maxlength="6"
  aria-label="Verification code"
/>
```

## Example

{{< example src="examples/elements/input-otp.html" title="Input OTP example" height="190" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint exports no runtime behavior. Native HTML, CSS, and AngularTS own the complete contract.

Read the [complete input-otp component reference]({{< relref
"/docs/components/input-otp" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
