---
title: card
notoc: true
description: >
  Sectioned content container
---

Cards are CSS-first containers composed from slot attributes.

```html
<section data-slot="card">
  <header data-slot="card-header">
    <h3 data-slot="card-title">Title</h3>
    <p data-slot="card-description">Description</p>
  </header>
  <div data-slot="card-content">Content</div>
  <footer data-slot="card-footer">Footer</footer>
</section>
```

## Example

{{< example src="examples/elements/card.html" title="Card example" height="420" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `card` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete card component reference]({{< relref
"/docs/components/card" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
