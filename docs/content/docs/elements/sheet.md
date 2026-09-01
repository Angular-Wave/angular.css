---
title: sheet
notoc: true
description: >
  Edge anchored overlay panels
---

The element entrypoint exposes the same semantic Sheet implementation and CSS as
the component entrypoint.

```html
<section ng-sheet side="right">
  <button class="sheet-trigger">Open</button>
  <div class="sheet-overlay"></div>
  <dialog class="sheet-content">
    <h2 class="sheet-title">Settings</h2>
    <button class="sheet-close">Close</button>
  </dialog>
</section>
```

## Example

{{< example src="examples/elements/sheet.html" title="Sheet example" height="420" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `sheet` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete sheet component reference]({{< relref
"/docs/components/sheet" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
