---
title: dropdown-menu
description: >
  Menu opened from a trigger button
---

Use `ng-dropdown` on a wrapper with a trigger `button` and a panel with
`role="menu"`.

```html
<div ng-dropdown>
  <button type="button">Options</button>
  <menu>
    <a href="#new">New Task</a>
    <a href="#edit">Edit Task</a>
    <a href="#delete">Delete Task</a>
  </menu>
</div>
```

The directive manages `aria-expanded`, `aria-controls`, `data-open`, outside
click close, escape close, and arrow-key focus movement. It does not publish
scope methods or own AngularTS application state. If the menu needs to be
controlled externally, update the wrapper or panel `data-open` attribute from
your AngularTS state.

## Example

{{< example src="examples/components/dropdown.html" title="Dropdown menu example" height="320" >}}

## Reference workflows

The workflow page covers basic and dynamically inserted items, an avatar
trigger, AngularTS-owned checkbox and radio state, shortcuts, destructive
items, submenus, right-to-left direction, and disabled triggers.

{{< example src="examples/components/dropdown-workflows.html" title="Dropdown menu reference workflows" height="1380" >}}
