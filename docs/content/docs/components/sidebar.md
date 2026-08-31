---
title: sidebar
category: 'navigation'
description: >
  Application sidebar layout with collapsible state
---

Use `ng-sidebar` for the navigation landmark inside `ng-sidebar-layout` and
connect native button triggers with `aria-controls` or `data-sidebar-target`.
Author physical side, visual variant, and collapse mode directly on the sidebar
root.

```html
<div ng-sidebar-layout>
  <aside id="app-sidebar" ng-sidebar side="left" collapsible="icon">
    <header ng-sidebar-header>
      <a ng-sidebar-menu-button href="/">Acme Inc.</a>
    </header>
    <div ng-sidebar-content>
      <section ng-sidebar-group>
        <div ng-sidebar-group-label>Workspace</div>
        <div ng-sidebar-group-content>
          <ul ng-sidebar-menu>
            <li ng-sidebar-menu-item>
              <a ng-sidebar-menu-button data-active="true" href="/dashboard">
                Dashboard
              </a>
            </li>
          </ul>
        </div>
      </section>
    </div>
  </aside>
  <main ng-sidebar-inset>
    <button aria-controls="app-sidebar">Toggle sidebar</button>
  </main>
</div>
```

The directive mirrors root options, responsive state, active destinations, group
relationships, and trigger accessibility state. AngularTS may control
`data-state`; it continues to own filtering, shortcuts, routing, and actions.
Compose nested disclosure with `ng-collapsible` and action menus with
`ng-dropdown`.

## Example

{{< example src="examples/components/sidebar.html" title="Controlled application sidebar" height="600" >}}

## Anatomy

Header and footer menus, labeled groups, actions, badges, submenus, and loading
rows remain independently composable.

{{< example src="examples/components/sidebar-anatomy.html" title="Sidebar anatomy" height="760" >}}

## Collapsible Navigation

This example delegates both group and menu disclosure to the existing
Collapsible primitive.

{{< example src="examples/components/sidebar-collapsible.html" title="Collapsible sidebar navigation" height="660" >}}

## RTL

Physical right placement and logical borders, actions, and submenu indentation
follow the authored document direction.

{{< example src="examples/components/sidebar-rtl.html" title="Right-to-left sidebar" height="660" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This component's root directive is `[ng-sidebar]`. Importing the package registers it with the AngularCSS `ui` module; there is no per-component JavaScript registration step.

## Anatomy

### Directive selectors

- `ng-sidebar`
- `ng-sidebar-group`
- `ng-sidebar-group-action`
- `ng-sidebar-group-label`
- `ng-sidebar-menu-action`
- `ng-sidebar-menu-button`
- `ng-sidebar-trigger`

### Styling slots

- `[data-slot="dropdown-menu"]`
- `[data-slot="sidebar"]`
- `[data-slot="sidebar-container"]`
- `[data-slot="sidebar-content"]`
- `[data-slot="sidebar-footer"]`
- `[data-slot="sidebar-gap"]`
- `[data-slot="sidebar-group"]`
- `[data-slot="sidebar-group-action"]`
- `[data-slot="sidebar-group-content"]`
- `[data-slot="sidebar-group-label"]`
- `[data-slot="sidebar-header"]`
- `[data-slot="sidebar-inner"]`
- `[data-slot="sidebar-input"]`
- `[data-slot="sidebar-inset"]`
- `[data-slot="sidebar-layout"]`
- `[data-slot="sidebar-menu"]`
- `[data-slot="sidebar-menu-action"]`
- `[data-slot="sidebar-menu-badge"]`
- `[data-slot="sidebar-menu-button"]`
- `[data-slot="sidebar-menu-item"]`
- `[data-slot="sidebar-menu-skeleton"]`
- `[data-slot="sidebar-menu-sub"]`
- `[data-slot="sidebar-menu-sub-button"]`
- `[data-slot="sidebar-rail"]`
- `[data-slot="sidebar-separator"]`
- `[data-slot="sidebar-trigger"]`
- `[data-slot="sidebar-wrapper"]`

Place `ng-sidebar` inside `ng-sidebar-layout` and connect native button triggers with `aria-controls` or `data-sidebar-target`. Author `side=left|right`, `variant=sidebar|floating|inset`, and `collapsible=offcanvas|icon|none` on the root. Header, content, footer, inset, groups, menus, actions, badges, submenus, rail, separator, input, and skeleton are optional composition selectors. Prefer semantic `ng-sidebar-*` attributes when behavior or styling is supplied and do not duplicate them with `data-slot`; use `data-slot` only for styling-only primitives. Compose collapsible groups with `ng-collapsible` and action menus with `ng-dropdown`.
Use the named slots as stable Tailwind and CSS selectors.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-controls` | Output | ARIA relationship or state. |
| `aria-current` | Input/output | Current item or date state. |
| `aria-expanded` | Output | Open or expanded state exposed to assistive technology. |
| `aria-hidden` | Output | ARIA relationship or state. |
| `aria-labelledby` | Output | ARIA relationship or state. |
| `collapsible` | Output | Authored option or semantic HTML attribute observed by the directive. |
| `data-active` | Input/output | Stable component state or styling hook. |
| `data-collapsible` | Input/output | Stable component state or styling hook. |
| `data-direction` | Output | Stable component state or styling hook. |
| `data-mobile` | Output | Stable component state or styling hook. |
| `data-open` | Output | Stable component state or styling hook. |
| `data-side` | Output | Stable component state or styling hook. |
| `data-sidebar-controlled` | Input | Stable component state or styling hook. |
| `data-state` | Input/output | Stable component state or styling hook. |
| `data-variant` | Output | Stable component state or styling hook. |
| `dir` | Input/output | Text and interaction direction: `ltr` or `rtl`. |
| `role` | Input/output | Explicit semantic role when native HTML does not provide one. |
| `side` | Output | Physical placement: `left`, `top`, `bottom`, or `right`. |
| `type` | Input/output | Component or native behavior variant. |
| `variant` | Output | Visual variant token supported by the component stylesheet. |

`Input` attributes are read from authored HTML. `Output` attributes are maintained by AngularCSS for CSS and testing. `Input/output` attributes may be authored for a controlled initial state and are then synchronized by the directive.

### CSS custom properties

This directive does not write component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

The directive reflects authored side, variant, collapsible, direction, responsive, active-item, group, and trigger state. It owns only sidebar collapse and accessibility synchronization; `collapsible=none` stays expanded, off-canvas collapse hides the landmark, and icon collapse keeps visible controls accessible. AngularTS remains responsible for controlled open state, shortcuts, filtering, routing, application actions, and structural rendering. Compose nested disclosure with the existing Collapsible primitive and menus with the existing Dropdown primitive.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Give the sidebar landmark and icon-only actions useful accessible names. Triggers expose `aria-controls` and expanded state, groups are associated with visible labels, and the current destination uses `aria-current=page`. Off-canvas collapse hides the landmark and restores trigger focus when necessary; icon collapse preserves access to its visible controls. Keep DOM order aligned with physical placement and use native links for destinations.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target `[ng-sidebar]`, the documented `data-slot` selectors, and generated `data-*` states from Tailwind or ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
