---
title: tooltip
notoc: true
description: >
  Contextual hover and focus labels
---

Use a tooltip wrapper, trigger, and content. Content can be held visible with
`data-open="true"` for controlled examples.

```html
<span class="tooltip">
  <button class="tooltip-trigger">Hover</button>
  <span class="tooltip-content">Add to library</span>
</span>
```

## Example

{{< example src="examples/elements/tooltip.html" title="Tooltip example" height="180" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `tooltip` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete tooltip component reference]({{< relref
"/docs/components/tooltip" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
