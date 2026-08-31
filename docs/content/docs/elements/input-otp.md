---
title: input-otp
notoc: true
description: >
  One-time password input slots
---

Group OTP slots with `data-slot="input-otp-group"` and mark the active slot with
`data-active="true"`.

```html
<div data-slot="input-otp">
  <div data-slot="input-otp-group">
    <div data-slot="input-otp-slot">1</div>
    <div data-slot="input-otp-slot" data-active="true">2</div>
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
