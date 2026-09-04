---
title: tabs
notoc: true
description: >
  Tabbed content sections
---

Add `ng-tabs` to a section, place native buttons in its list, and follow the
list with direct semantic `section` or `article` panels. The directive owns the
tab roles, relationships, selection state, and keyboard navigation.

```html
<section ng-tabs>
  <menu>
    <button aria-selected="true">Overview</button>
  </menu>
  <section>Content</section>
</section>
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
