---
title: dialog
notoc: true
description: >
  Modal dialog structure
---

This compatibility entrypoint renders the same packaged semantic Dialog artifact
as the component page.

```html
<section ng-dialog>
  <button ng-dialog-trigger>Edit profile</button>
  <div ng-dialog-overlay></div>
  <section ng-dialog-content>
    <h2 ng-dialog-title>Edit profile</h2>
  </section>
</section>
```

## Example

{{< example src="examples/elements/dialog.html" title="Dialog example" height="420" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `dialog` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete dialog component reference]({{< relref
"/docs/components/dialog" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
