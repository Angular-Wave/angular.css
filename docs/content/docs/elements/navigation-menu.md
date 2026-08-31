---
title: navigation-menu
notoc: true
description: >
  Site navigation with optional flyout content
---

Navigation menu is exposed as semantic `nav` markup with list, item, trigger,
link, and content slots.

```html
<nav data-slot="navigation-menu">
  <ul data-slot="navigation-menu-list">
    <li data-slot="navigation-menu-item">
      <button data-slot="navigation-menu-trigger">Components</button>
      <div data-slot="navigation-menu-content">Links</div>
    </li>
  </ul>
</nav>
```

## Example

{{< example src="examples/elements/navigation-menu.html" title="Navigation menu example" height="620" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `navigation-menu` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete navigation-menu component reference]({{< relref
"/docs/components/navigation-menu" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
