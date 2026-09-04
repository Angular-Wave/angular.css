---
title: alert
notoc: true
description: >
  Status message element
---

Use `section.alert` for static status messages. The first heading is the title,
the following paragraph is the description, and an optional SVG may provide an
icon.

```html
<section class="alert">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="m9 12 2 2 4-4"></path>
  </svg>
  <div>Success! Your changes have been saved.</div>
  <div>This is an alert with icon, title, and description.</div>
</section>
```

## Example

{{< example src="examples/elements/alert.html" title="Alert example" height="190" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint exports no runtime behavior. Native HTML, CSS, and AngularTS own the complete contract.

Read the [complete alert component reference]({{< relref
"/docs/components/alert" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
