---
title: hover-card
notoc: true
description: >
  Rich hover preview cards
---

Use hover card slots for a trigger and preview content. Set `data-open="true"`
when rendering a controlled preview.

```html
<span data-slot="hover-card">
  <a data-slot="hover-card-trigger" href="#">@angularcss</a>
  <span data-slot="hover-card-content">Preview</span>
</span>
```

## Example

{{< example src="examples/elements/hover-card.html" title="Hover card example" height="260" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `hover-card` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete hover-card component reference]({{< relref
"/docs/components/hover-card" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
