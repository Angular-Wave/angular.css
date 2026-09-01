---
title: progress
notoc: true
description: >
  Task completion indicator
---

Use native `progress`. Compose its label and value with native `label` and
`output` elements when needed.

```html
<div class="progress-group">
  <label id="upload-progress-label" class="progress-label">Upload progress</label>
  <output class="progress-value">56%</output>
  <progress class="progress" value="56" max="100" aria-labelledby="upload-progress-label"></progress>
</div>
```

## Example

{{< example src="examples/elements/progress.html" title="Progress example" height="190" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint exports no runtime behavior. Native HTML, CSS, and AngularTS own the complete contract.

Read the [complete progress component reference]({{< relref
"/docs/components/progress" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
