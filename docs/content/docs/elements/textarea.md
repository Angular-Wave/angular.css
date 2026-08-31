---
title: textarea
notoc: true
description: >
  Native multiline text control
---

Use native `textarea` elements for multiline input. AngularCSS styles opt-in
`ng-textarea` controls and also supports `data-slot="textarea"`.

```html
<textarea
  ng-textarea
  id="message"
  placeholder="Add a message"
  ng-model="message"
></textarea>
<span>Message: <span ng-bind="message"></span></span>
<textarea ng-textarea id="invalid-message" aria-invalid="true"></textarea>
```

## Example

{{< example src="examples/elements/textarea.html" title="Textarea example" height="300" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `textarea` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete textarea component reference]({{< relref
"/docs/components/textarea" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
