---
title: popover
notoc: true
description: >
  Floating rich content panels
---

Use part classes for the trigger and content. Set `data-open="true"` when a
controller should render the panel open.

```html
<span class="popover">
  <button class="popover-trigger">Open</button>
  <aside data-open="true" class="popover-content">Content</aside>
</span>
```

## Example

{{< example src="examples/elements/popover.html" title="Popover example" height="270" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `popover` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete popover component reference]({{< relref
"/docs/components/popover" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
