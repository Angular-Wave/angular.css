---
title: dropdown
category: 'layout'
description: >
  Menu opened from a trigger button
---

Use `ng-dropdown` on a wrapper with a trigger `button` and a menu panel
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

The directive manages `aria-expanded`, `aria-controls`, `data-open`, outside
click close, escape close, and arrow-key focus movement. It does not publish
scope methods or own AngularTS application state. If the menu needs to be
controlled externally, update the wrapper or panel `data-open` attribute from
your AngularTS state.

## Example

{{< example src="examples/components/dropdown.html" title="Dropdown menu example" height="440" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This component's root directive is `[ng-dropdown]`. Importing the package registers it with the AngularCSS `ui` module; there is no per-component JavaScript registration step.

## Anatomy

### Directive selectors

- `ng-dropdown`
- `ng-dropdown-content`

### Styling slots

- `[data-slot="dropdown-menu"]`
- `[data-slot="dropdown-menu-checkbox-item"]`
- `[data-slot="dropdown-menu-checkbox-item-indicator"]`
- `[data-slot="dropdown-menu-content"]`
- `[data-slot="dropdown-menu-group"]`
- `[data-slot="dropdown-menu-item"]`
- `[data-slot="dropdown-menu-label"]`
- `[data-slot="dropdown-menu-radio-group"]`
- `[data-slot="dropdown-menu-radio-item"]`
- `[data-slot="dropdown-menu-radio-item-indicator"]`
- `[data-slot="dropdown-menu-separator"]`
- `[data-slot="dropdown-menu-shortcut"]`
- `[data-slot="dropdown-menu-sub"]`
- `[data-slot="dropdown-menu-sub-content"]`
- `[data-slot="dropdown-menu-sub-trigger"]`
- `[data-slot="dropdown-menu-trigger"]`

Slots are optional unless the usage example or behavior description identifies a required relationship.
Use the named slots as stable Tailwind and CSS selectors.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-controls` | Output | ARIA relationship or state. |
| `aria-disabled` | Input | Semantic disabled state. |
| `aria-expanded` | Output | Open or expanded state exposed to assistive technology. |
| `aria-haspopup` | Input/output | ARIA relationship or state. |
| `aria-labelledby` | Output | ARIA relationship or state. |
| `data-disabled` | Input | Stable component state or styling hook. |
| `data-open` | Input/output | Stable component state or styling hook. |
| `data-size` | Input | Stable component state or styling hook. |
| `data-state` | Output | Stable component state or styling hook. |
| `dir` | Input | Text and interaction direction: `ltr` or `rtl`. |
| `disabled` | Input | Disables native or component interaction. |
| `role` | Input/output | Explicit semantic role when native HTML does not provide one. |
| `size` | Input | Visual size token supported by the component stylesheet. |
| `tabindex` | Input/output | Keyboard focus order for composite descendants. |

`Input` attributes are read from authored HTML. `Output` attributes are maintained by AngularCSS for CSS and testing. `Input/output` attributes may be authored for a controlled initial state and are then synchronized by the directive.

### CSS custom properties

This directive does not write component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

The directive owns menu disclosure, focus movement, escape handling, and outside-click closure. Command execution and checked values remain application-owned.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Triggers expose popup and expanded state. Arrow keys move among enabled items, Escape closes the menu, and focus returns to the invoking control when appropriate.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target `[ng-dropdown]`, the documented `data-slot` selectors, and generated `data-*` states from Tailwind or ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
