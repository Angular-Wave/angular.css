---
title: field
notoc: true
description: >
  Semantic form field layout
---

Use field parts to group controls, labels, descriptions, and errors. The
contract is HTML-first: `fieldset`, `legend`, `label`, `p`, and plain wrappers
carry `class` attributes.

```html
<div class="field">
  <label for="email" class="field-label label">Email</label>
  <input id="email" type="email" placeholder="Email" class="input" />
  <p class="field-description">Use your work email.</p>
</div>

<div data-invalid class="field">
  <label for="invalid-email" class="field-label label">Email</label>
  <input id="invalid-email" aria-invalid="true" class="input" />
  <p class="field-error">Enter a valid email.</p>
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
