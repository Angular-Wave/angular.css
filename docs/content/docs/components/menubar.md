---
title: menubar
category: 'menu'
description: >
  Keyboard-first top-level navigation with open/close menu behavior.
---

Use `ng-menubar` around a strip of menu groups. Menu triggers support:

- `ArrowLeft`/`ArrowRight` to move between menus
- `Enter`/`Space`/`ArrowDown` to open a menu
- `Escape` to close menus
- `Home`/`End` shortcuts when a trigger is focused

```html
<nav ng-menubar role="menubar" aria-label="Application menu">
  <div data-slot="menubar-menu">
    <button data-slot="menubar-trigger" role="menuitem">File</button>
    <div data-slot="menubar-content" role="menu">
      <button data-slot="menubar-item" role="menuitem">New</button>
      <button data-slot="menubar-item" role="menuitem">Open</button>
    </div>
  </div>
  <div data-slot="menubar-menu">
    <button data-slot="menubar-trigger" role="menuitem">Edit</button>
  </div>
</nav>
```

## Example

{{< example src="examples/components/menubar.html" title="Menubar example" height="360" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This component's root directive is `[ng-menubar]`. Importing the package registers it with the AngularCSS `ui` module; there is no per-component JavaScript registration step.

## Anatomy

### Directive selectors

- `ng-menubar`
- `ng-menubar-content`
- `ng-menubar-item`
- `ng-menubar-menu`
- `ng-menubar-sub-trigger`
- `ng-menubar-trigger`

### Styling slots

- `[data-slot="menubar"]`
- `[data-slot="menubar-checkbox-item"]`
- `[data-slot="menubar-content"]`
- `[data-slot="menubar-group"]`
- `[data-slot="menubar-item"]`
- `[data-slot="menubar-label"]`
- `[data-slot="menubar-menu"]`
- `[data-slot="menubar-radio-group"]`
- `[data-slot="menubar-radio-item"]`
- `[data-slot="menubar-separator"]`
- `[data-slot="menubar-shortcut"]`
- `[data-slot="menubar-sub"]`
- `[data-slot="menubar-sub-content"]`
- `[data-slot="menubar-sub-trigger"]`
- `[data-slot="menubar-trigger"]`

Each menu requires one native button trigger and one content element. Groups, separators, shortcuts, checkbox items, radio groups, and nested submenus are optional. Use either `ng-menubar-*` attributes for semantic behavior and styling or `data-slot` hooks when behavior is already supplied; do not duplicate both on one element.
Use the named slots as stable Tailwind and CSS selectors.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `data-open` | Input | Stable component state or styling hook. |
| `data-state` | Input | Stable component state or styling hook. |
| `dir` | Input | Text and interaction direction: `ltr` or `rtl`. |
| `role` | Input | Explicit semantic role when native HTML does not provide one. |
| `tabindex` | Input | Keyboard focus order for composite descendants. |

`Input` attributes are read from authored HTML. `Output` attributes are maintained by AngularCSS for CSS and testing. `Input/output` attributes may be authored for a controlled initial state and are then synchronized by the directive.

### CSS custom properties

This directive does not write component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

The directive owns top-level roving focus, menu and submenu disclosure, enabled-item navigation, Escape and outside-click closure, DOM-order synchronization for dynamically inserted menus, and direction-aware horizontal keys. AngularTS remains responsible for command execution, checkbox and radio values, and structural content such as `ng-if`.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

The root exposes `role="menubar"` and keeps one enabled top-level trigger in the tab order. Triggers identify their menus with `aria-controls`; disabled triggers and items are skipped. Arrow keys follow visual direction, submenu keys remain local to the submenu, and Escape restores focus to the active trigger.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target `[ng-menubar]`, the documented `data-slot` selectors, and generated `data-*` states from Tailwind or ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
