---
title: avatar
notoc: true
description: >
  User image, fallback, badge, and group primitive
---

Use `data-slot="avatar"` with optional image, fallback, badge, and group slots.

```html
<span data-slot="avatar">
  <span data-slot="avatar-fallback">JD</span>
  <span data-slot="avatar-badge"></span>
</span>
```

## Example

{{< example src="examples/elements/avatar.html" title="Avatar example" height="180" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `avatar` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete avatar component reference]({{< relref
"/docs/components/avatar" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
