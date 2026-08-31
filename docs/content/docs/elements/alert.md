---
title: alert
notoc: true
description: >
  Status message element
---

Use `ng-alert` for static status messages. The first text child is treated as
the title, and the next text child is treated as the description. An optional
leading SVG icon is supported.

```html
<div ng-alert>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="m9 12 2 2 4-4"></path>
  </svg>
  <div>Success! Your changes have been saved.</div>
  <div>This is an alert with icon, title, and description.</div>
</div>
```

## Example

{{< example src="examples/elements/alert.html" title="Alert example" height="190" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `alert` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete alert component reference]({{< relref
"/docs/components/alert" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
