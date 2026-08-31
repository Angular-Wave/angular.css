---
title: sonner
notoc: true
description: >
  Toast notification stack
---

Use toaster and toast slots for notification stacks. Toast behavior and timers
stay in application TypeScript.

```html
<div data-slot="toaster">
  <section data-slot="toast">
    <div data-slot="toast-title">Saved</div>
  </section>
</div>
```

## Example

{{< example src="examples/elements/sonner.html" title="Sonner example" height="280" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `sonner` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete sonner component reference]({{< relref
"/docs/components/sonner" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
