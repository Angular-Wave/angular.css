---
title: dropdown
description: >
  Menu opened from a trigger button
---

Use `ng-dropdown` on a wrapper with a trigger `button` and a panel with
`role="menu"`.

```html
<div ng-dropdown>
  <button type="button">Options</button>
  <div role="menu">
    <a href="#new">New Task</a>
    <a href="#edit">Edit Task</a>
    <a href="#delete">Delete Task</a>
  </div>
</div>
```

The directive manages ARIA state, `data-open`, outside click close, escape
close, and arrow-key focus movement. It does not publish scope methods or own
AngularTS application state. For external control, update `data-open` from
AngularTS state.

## Example

{{< example src="examples/elements/dropdown.html" title="Dropdown element example" height="440" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `dropdown` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete dropdown component reference]({{< relref
"/docs/components/dropdown" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
