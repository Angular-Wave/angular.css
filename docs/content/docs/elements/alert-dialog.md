---
title: alert-dialog
notoc: true
description: >
  Confirmation dialog structure
---

Use alert dialog slots for destructive or confirmation flows that need a clear
action and cancel target.

```html
<section data-slot="alert-dialog">
  <div data-slot="alert-dialog-overlay"></div>
  <div data-slot="alert-dialog-content" role="alertdialog" aria-modal="true">
    <h2 data-slot="alert-dialog-title">Delete project?</h2>
  </div>
</section>
```

## Example

{{< example src="examples/elements/alert-dialog.html" title="Alert dialog example" height="350" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `alert-dialog` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete alert-dialog component reference]({{< relref
"/docs/components/alert-dialog" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
