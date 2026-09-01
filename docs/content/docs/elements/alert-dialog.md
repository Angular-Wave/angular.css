---
title: alert-dialog
notoc: true
description: >
  Confirmation dialog structure
---

Use alert dialog parts for destructive or confirmation flows that need a clear
action and cancel target.

```html
<section class="alert-dialog">
  <button commandfor="delete-dialog" command="show-modal">Delete</button>
  <dialog id="delete-dialog" closedby="closerequest" class="alert-dialog-content">
    <h2 class="alert-dialog-title">Delete project?</h2>
  </dialog>
</section>
```

## Example

{{< example src="examples/elements/alert-dialog.html" title="Alert dialog example" height="350" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint exports no runtime behavior. Native HTML, CSS, and AngularTS own the complete contract.

Read the [complete alert-dialog component reference]({{< relref
"/docs/components/alert-dialog" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
