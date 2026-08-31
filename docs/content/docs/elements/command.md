---
title: command
notoc: true
description: >
  Command palette layout
---

Use command slots for the input, grouped result list, items, shortcuts, and
empty state.

```html
<section data-slot="command">
  <div data-slot="command-input-wrapper">
    <input data-slot="command-input" />
  </div>
  <div data-slot="command-list">
    <div data-slot="command-item">Open file</div>
  </div>
</section>
```

## Example

{{< example src="examples/elements/command.html" title="Command example" height="390" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `command` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete command component reference]({{< relref
"/docs/components/command" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
