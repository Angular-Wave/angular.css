---
title: card
notoc: true
description: >
  Sectioned content container
---

Cards are CSS-first semantic article compositions.

```html
<section class="card">
  <header class="card-header">
    <h2 class="card-title">Title</h2>
    <p class="card-description">Description</p>
  </header>
  <section class="card-content">Content</section>
  <footer class="card-footer">Footer</footer>
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
