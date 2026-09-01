---
title: command
notoc: true
description: >
  Command palette layout
---

Use command parts for the input, grouped result list, items, shortcuts, and
empty state.

```html
<section class="command">
  <div class="command-input-wrapper">
    <input  class="command-input"/>
  </div>
  <ul class="command-list">
    <li class="command-item">Open file</li>
  </ul>
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
