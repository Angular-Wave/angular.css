---
title: sheet
notoc: true
description: >
  Edge anchored overlay panels
---

The styling entrypoint exposes the same native Sheet structure and CSS.

```html
<section class="sheet">
  <button commandfor="settings-sheet" command="show-modal">Open</button>
  <dialog id="settings-sheet" side="right">
    <h2>Settings</h2>
    <button commandfor="settings-sheet" command="close">Close</button>
  </dialog>
</section>
```

## Example

{{< example src="examples/elements/sheet.html" title="Sheet example" height="420" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint exports no runtime behavior. Native HTML, CSS, and AngularTS own the complete contract.

Read the [complete sheet component reference]({{< relref
"/docs/components/sheet" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
