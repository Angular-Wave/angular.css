---
title: tabs
notoc: true
description: >
  Tabbed content sections
---

Use ARIA tab roles and slot attributes. Set active triggers with
`aria-selected="true"` or `data-active="true"`.

```html
<div data-slot="tabs">
  <div data-slot="tabs-list" role="tablist">
    <button data-slot="tabs-trigger" role="tab" aria-selected="true">
      Overview
    </button>
  </div>
  <div data-slot="tabs-content" role="tabpanel">Content</div>
</div>
```

## Example

{{< example src="examples/elements/tabs.html" title="Tabs example" height="330" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `tabs` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete tabs component reference]({{< relref
"/docs/components/tabs" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
