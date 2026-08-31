---
title: progress
notoc: true
description: >
  Task completion indicator
---

Use native `progress` or a slot-based progress wrapper when you need a label and
value display.

```html
<div ng-progress value="56" max="100">
  <span ng-progress-label>Upload progress</span>
  <span ng-progress-value></span>
  <span ng-progress-track>
    <span ng-progress-indicator></span>
  </span>
</div>
```

## Example

{{< example src="examples/elements/progress.html" title="Progress example" height="190" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `progress` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete progress component reference]({{< relref
"/docs/components/progress" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
