---
title: drawer
notoc: true
description: >
  Bottom anchored drawer panels
---

This styling entrypoint uses the same native Drawer artifact as the component
page.

```html
<section class="drawer">
  <button commandfor="goal-drawer" command="show-modal">Open Drawer</button>
  <dialog id="goal-drawer" side="bottom"></dialog>
</section>
```

## Example

{{< example src="examples/elements/drawer.html" title="Drawer example" height="460" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint exports no runtime behavior. Native HTML, CSS, and AngularTS own the complete contract.

Read the [complete drawer component reference]({{< relref
"/docs/components/drawer" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
