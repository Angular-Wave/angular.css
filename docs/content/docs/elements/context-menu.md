---
title: context-menu
notoc: true
description: >
  Context menu surface and items
---

Use the trigger and content slots with menu item, checkbox item, radio item,
separator, and shortcut slots.

```html
<div data-slot="context-menu">
  <div data-slot="context-menu-trigger">Right click</div>
  <div data-slot="context-menu-content" role="menu">
    <button data-slot="context-menu-item" role="menuitem">Reload</button>
  </div>
</div>
```

## Example

{{< example src="examples/elements/context-menu.html" title="Context menu example" height="420" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `context-menu` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete context-menu component reference]({{< relref
"/docs/components/context-menu" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
