---
title: textarea
notoc: true
description: >
  Native multiline text control
---

Use native `textarea` elements with `class="textarea"` for multiline input.

```html
<textarea

  id="message"
  placeholder="Add a message"
  ng-model="message" class="textarea"></textarea>
<span>Message: <span ng-bind="message"></span></span>
<textarea id="invalid-message" aria-invalid="true" class="textarea"></textarea>
```

## Example

{{< example src="examples/elements/textarea.html" title="Textarea example" height="300" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint exports no runtime behavior. Native HTML, CSS, and AngularTS own the complete contract.

Read the [complete textarea component reference]({{< relref
"/docs/components/textarea" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
