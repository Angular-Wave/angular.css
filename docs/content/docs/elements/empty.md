---
title: empty
notoc: true
description: >
  Empty state layout
---

Empty states compose media, title, description, and action content slots.

```html
<section data-slot="empty">
  <div data-slot="empty-header">
    <div data-slot="empty-media" variant="icon"></div>
    <h3 data-slot="empty-title">No projects yet</h3>
    <p data-slot="empty-description">Create your first project.</p>
  </div>
</section>
```

## Example

{{< example src="examples/elements/empty.html" title="Empty example" height="340" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `empty` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete empty component reference]({{< relref
"/docs/components/empty" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
