---
title: field
notoc: true
description: >
  Semantic form field layout
---

Use field slots to group controls, labels, descriptions, and errors. The
contract is HTML-first: `fieldset`, `legend`, `label`, `p`, and plain wrappers
carry `data-slot` attributes.

```html
<div data-slot="field">
  <label ng-label data-slot="field-label" for="email">Email</label>
  <input data-input id="email" type="email" placeholder="Email" />
  <p data-slot="field-description">Use your work email.</p>
</div>

<div data-slot="field" data-invalid>
  <label ng-label data-slot="field-label" for="invalid-email">Email</label>
  <input data-input id="invalid-email" aria-invalid="true" />
  <p data-slot="field-error" role="alert">Enter a valid email.</p>
</div>
```

## Example

{{< example src="examples/elements/field.html" title="Field example" height="360" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `field` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete field component reference]({{< relref
"/docs/components/field" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
