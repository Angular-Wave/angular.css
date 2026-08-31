---
title: navigation-menu
category: 'navigation'
description: >
  Site navigation with optional flyout content
---

Navigation menu is exposed as semantic `nav` markup with list, item, trigger,
link, and content slots.

```html
<nav data-slot="navigation-menu">
  <ul data-slot="navigation-menu-list">
    <li data-slot="navigation-menu-item">
      <button data-slot="navigation-menu-trigger">Components</button>
      <div data-slot="navigation-menu-content">Links</div>
    </li>
  </ul>
</nav>
```

## Example

{{< example src="examples/components/navigation-menu.html" title="Navigation menu example" height="620" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This component's root directive is `[ng-navigation-menu]`. Importing the package registers it with the AngularCSS `ui` module; there is no per-component JavaScript registration step.

## Anatomy

### Directive selectors

- `ng-navigation-menu`
- `ng-navigation-menu-content`
- `ng-navigation-menu-item`
- `ng-navigation-menu-link`
- `ng-navigation-menu-list`
- `ng-navigation-menu-trigger`

### Styling slots

- `[data-slot="navigation-menu"]`
- `[data-slot="navigation-menu-content"]`
- `[data-slot="navigation-menu-indicator"]`
- `[data-slot="navigation-menu-item"]`
- `[data-slot="navigation-menu-link"]`
- `[data-slot="navigation-menu-list"]`
- `[data-slot="navigation-menu-trigger"]`

Use a native `nav` containing one direct list. Each list item may contain either a native link or a native button trigger followed by its flyout content. The indicator is optional. Use either `ng-navigation-menu-*` selectors for behavior and styling or `data-slot` hooks when behavior is supplied elsewhere; do not duplicate both on one element.
Use the named slots as stable Tailwind and CSS selectors.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `align` | Input | Cross-axis alignment: `start`, `center`, or `end`. |
| `aria-hidden` | Input | ARIA relationship or state. |
| `data-open` | Input | Stable component state or styling hook. |
| `data-state` | Input | Stable component state or styling hook. |
| `dir` | Input | Text and interaction direction: `ltr` or `rtl`. |
| `disabled` | Input | Disables native or component interaction. |
| `role` | Input | Explicit semantic role when native HTML does not provide one. |

`Input` attributes are read from authored HTML. `Output` attributes are maintained by AngularCSS for CSS and testing. `Input/output` attributes may be authored for a controlled initial state and are then synchronized by the directive.

### CSS custom properties

- `--navigation-menu-content-offset`

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

The directive owns site-navigation disclosure, focus restoration, direction-aware arrow movement, dynamic DOM-order synchronization, outside dismissal, and flyout collision handling. Native links continue to own navigation. URLs, routing, current-page state, authored controlled state, and application commands remain AngularTS or application concerns.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Use a native `nav` landmark containing a list. Keep destinations as native links and disclosure controls as native buttons; do not add menu or menuitem roles to site navigation. Triggers expose `aria-expanded` and `aria-controls`, direct links remain in horizontal keyboard order, and Escape restores focus to the active trigger.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target `[ng-navigation-menu]`, the documented `data-slot` selectors, and generated `data-*` states from Tailwind or ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
