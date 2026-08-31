---
title: sidebar
notoc: true
description: >
  Application sidebar layout
---

Use sidebar layout, sidebar, group, menu, and inset slots for app shells.

```html
<div data-slot="sidebar-layout">
  <aside data-slot="sidebar"></aside>
  <main data-slot="sidebar-inset"></main>
</div>
```

## Example

{{< example src="examples/elements/sidebar.html" title="Sidebar example" height="400" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `sidebar` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete sidebar component reference]({{< relref
"/docs/components/sidebar" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
