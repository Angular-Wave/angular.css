---
title: dialog
notoc: true
description: >
  Modal dialog structure
---

This styling entrypoint uses the same native Dialog artifact as the component
page.

```html
<section class="dialog">
  <button commandfor="profile-dialog" command="show-modal">Edit profile</button>
  <dialog id="profile-dialog">
    <h2>Edit profile</h2>
  </dialog>
</section>
```

## Example

{{< example src="examples/elements/dialog.html" title="Dialog example" height="420" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint exports no runtime behavior. Native HTML, CSS, and AngularTS own the complete contract.

Read the [complete dialog component reference]({{< relref
"/docs/components/dialog" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
