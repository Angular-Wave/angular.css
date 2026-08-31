---
title: carousel
notoc: true
description: >
  Scroll snap carousel structure
---

Use a content viewport, track, items, navigation controls, and dots. Carousel
movement can be driven by native scrolling or application code.

```html
<section data-slot="carousel">
  <div data-slot="carousel-content">
    <div data-slot="carousel-track">
      <article data-slot="carousel-item">Slide</article>
    </div>
  </div>
</section>
```

## Example

{{< example src="examples/elements/carousel.html" title="Carousel example" height="350" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `carousel` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete carousel component reference]({{< relref
"/docs/components/carousel" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
