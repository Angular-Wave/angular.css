---
title: resizable
notoc: true
description: >
  Resizable panel group structure
---

Use panel group, panel, and handle parts. Application behavior can bind panel
sizes through `--panel-size`.

```html
<div class="resizable-panel-group">
  <section style="--panel-size: 2;" class="resizable-panel">One</section>
  <div class="resizable-handle"></div>
  <section class="resizable-panel">Two</section>
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
