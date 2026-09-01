---
title: context-menu
category: 'menu'
description: >
  Context menu surface and items
---

Use a semantic trigger and content surface. AngularCSS owns right-click and
keyboard disclosure, pointer placement, menu focus, and submenu navigation;
AngularTS owns actions and checkbox or radio values.

```html
<div ng-context-menu>
  <div class="context-menu-trigger">Right click here</div>
  <menu aria-label="Browser actions" class="context-menu-content">
    <button ng-click="reload()" class="context-menu-item">Reload</button>
    <button

      aria-checked="{{ showBookmarks }}"
      ng-click="showBookmarks=!showBookmarks"
     class="context-menu-checkbox-item">
      Show Bookmarks Bar
    </button>
  </menu>
</div>
```

Ordinary click is left to the authored trigger. Right-click, Shift F10, and the
Context Menu key open this component.

## Basic And Submenu

## Example

{{< example src="examples/components/context-menu.html" title="Context menu example" height="420" >}}

## Content And State

Icons, destructive actions, groups, shortcuts, checkbox values, and radio values
are functional packaged scenarios.

{{< example src="examples/components/context-menu-workflows.html" title="Context menu content and state workflows" height="800" >}}

## Placement

The six physical and logical side options anchor to the invocation point and
remain constrained to the viewport.

{{< example src="examples/components/context-menu-sides.html" title="Context menu side placement" height="650" >}}

## Right To Left

{{< example src="examples/components/context-menu-rtl.html" title="Right-to-left context menu" height="420" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This component's root directive is `[ng-context-menu]`. Importing the package registers it with the AngularCSS `ui` module; there is no per-component JavaScript registration step.

## Anatomy

### Directive selectors

- `ng-context-menu`

### Semantic structure

A context menu root requires one focusable trigger and one menu element. The root directive inspects semantic descendants through context-menu part classes; no child directives are required. Groups, separators, shortcuts, checked items, and submenus are optional.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `align` | Input | Cross-axis alignment: `start`, `center`, or `end`. |
| `align-offset` | Input | Authored option or semantic HTML attribute observed by the directive. |
| `aria-checked` | Input/output | ARIA relationship or state. |
| `aria-controls` | Output | ARIA relationship or state. |
| `aria-disabled` | Input/output | Semantic disabled state. |
| `aria-expanded` | Output | Open or expanded state exposed to assistive technology. |
| `aria-haspopup` | Output | ARIA relationship or state. |
| `aria-hidden` | Output | ARIA relationship or state. |
| `data-align` | Output | Stable component state or styling hook. |
| `data-direction` | Output | Stable component state or styling hook. |
| `data-disabled` | Output | Stable component state or styling hook. |
| `data-highlighted` | Output | Stable component state or styling hook. |
| `data-open` | Input/output | Stable component state or styling hook. |
| `data-side` | Output | Stable component state or styling hook. |
| `data-state` | Input/output | Stable component state or styling hook. |
| `dir` | Input | Text and interaction direction: `ltr` or `rtl`. |
| `disabled` | Input | Disables native or component interaction. |
| `role` | Output | Explicit semantic role when native HTML does not provide one. |
| `side` | Input | Physical placement: `left`, `top`, `bottom`, or `right`. |
| `side-offset` | Input | Authored option or semantic HTML attribute observed by the directive. |
| `tabindex` | Input/output | Keyboard focus order for composite descendants. |

`Input` attributes are read from authored HTML. `Output` attributes are maintained by AngularCSS for CSS and testing. `Input/output` attributes may be authored for a controlled initial state and are then synchronized by the directive.

### CSS custom properties

- `--context-menu-available-height`
- `--context-menu-left`
- `--context-menu-top`

### DOM events

- `angularcss:context-menu-select`

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

The directive owns right-click and keyboard disclosure, cursor-relative side placement with viewport collision constraints, menu and submenu focus movement, disabled-item skipping, Escape and outside dismissal, direction-aware submenu keys, semantic roles, and open-state reflection. AngularTS remains responsible for command execution, checkbox and radio values, controlled application state, and structural rendering.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Give the trigger and menu useful accessible names. The trigger exposes `aria-haspopup`, `aria-controls`, and expanded state; items receive menuitem, menuitemcheckbox, or menuitemradio roles; groups and separators remain semantic; disabled items are skipped. Shift+F10 or the Context Menu key opens from the keyboard, arrow keys move focus, logical submenu keys follow text direction, and Escape restores focus.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target `[ng-context-menu]`, semantic descendants, component classes, and generated state from Tailwind or ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
