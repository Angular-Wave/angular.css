---
title: drawer
notoc: true
description: >
  Bottom anchored drawer panels
---

This compatibility entrypoint renders the same packaged semantic Drawer artifact
as the component page.

```html
<section ng-drawer>
  <button ng-drawer-trigger>Open Drawer</button>
  <div ng-drawer-overlay></div>
  <section ng-drawer-content>
    <div ng-drawer-handle></div>
  </section>
</section>
```

## Example

{{< example src="examples/elements/drawer.html" title="Drawer example" height="460" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `drawer` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete drawer component reference]({{< relref
"/docs/components/drawer" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
