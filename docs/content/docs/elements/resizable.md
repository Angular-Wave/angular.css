---
title: resizable
notoc: true
description: >
  Resizable panel group structure
---

Use panel group, panel, and handle slots. Application behavior can bind panel
sizes through `--panel-size`.

```html
<div data-slot="resizable-panel-group">
  <section data-slot="resizable-panel" style="--panel-size: 2;">One</section>
  <div data-slot="resizable-handle"></div>
  <section data-slot="resizable-panel">Two</section>
</div>
```

## Example

{{< example src="examples/elements/resizable.html" title="Resizable example" height="270" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `resizable` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete resizable component reference]({{< relref
"/docs/components/resizable" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
