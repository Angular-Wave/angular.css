---
title: item
notoc: true
description: >
  Flexible list item primitive
---

Items compose media, content, title, description, and actions.

```html
<div data-slot="item" variant="outline">
  <div data-slot="item-content">
    <div data-slot="item-title">Item title</div>
    <p data-slot="item-description">Supporting description.</p>
  </div>
</div>
```

## Example

{{< example src="examples/elements/item.html" title="Item example" height="360" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `item` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete item component reference]({{< relref
"/docs/components/item" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
