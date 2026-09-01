---
title: input-otp
notoc: true
description: >
  One-time password input parts
---

Group OTP parts with `class="input-otp-group"` and mark the active part with
`data-active="true"`.

```html
<div class="input-otp">
  <div class="input-otp-group">
    <div class="input-otp-part">1</div>
    <div data-active="true" class="input-otp-part">2</div>
  </div>
</div>
```

## Example

{{< example src="examples/elements/input-otp.html" title="Input OTP example" height="190" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `input-otp` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete input-otp component reference]({{< relref
"/docs/components/input-otp" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
