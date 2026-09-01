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
<nav ng-menubar aria-label="Application menu">
  <div class="menubar-menu">
    <button class="menubar-trigger">File</button>
    <menu class="menubar-content">
      <button class="menubar-item">New</button>
      <button class="menubar-item">Open</button>
    </menu>
  </div>
  <div class="menubar-menu">
    <button class="menubar-trigger">Edit</button>
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

### Semantic structure

Each menu requires one native button trigger and one menu content element. The root directive inspects semantic descendants through menubar part classes; no child directives are required. Groups, separators, shortcuts, checked items, and submenus are optional.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-checked` | Input | ARIA relationship or state. |
| `data-open` | Input | Stable component state or styling hook. |
| `data-state` | Input | Stable component state or styling hook. |
| `dir` | Input | Text and interaction direction: `ltr` or `rtl`. |
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

Target `[ng-menubar]`, semantic descendants, component classes, and generated state from Tailwind or ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
