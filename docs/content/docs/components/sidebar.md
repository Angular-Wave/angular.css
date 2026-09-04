---
title: sidebar
category: 'navigation'
description: >
  Application sidebar layout with collapsible state
---

Use `ng-sidebar` on an `aside` inside `.sidebar-layout` and connect native
button triggers with `aria-controls`. Author physical side, visual variant, and
collapse mode directly on the sidebar root.

```html
<div>
  <aside id="app-sidebar" ng-sidebar side="left" collapsible="icon">
    <header>
      <a href="/">Acme Inc.</a>
    </header>
    <nav>
      <section>
        <h3>Workspace</h3>
        <div>
          <ul>
            <li>
              <a aria-current="page" href="/dashboard"> Dashboard </a>
            </li>
          </ul>
        </div>
      </section>
    </nav>
  </aside>
  <main>
    <button aria-controls="app-sidebar">Toggle sidebar</button>
  </main>
</div>
```

The directive reads root options and coordinates collapse, group relationships,
and trigger accessibility state. AngularTS may control the boolean `collapsed`
attribute; it continues to own filtering, shortcuts, routing, and actions.
Compose nested disclosure with native `details.collapsible` and action menus
with `ng-dropdown`.

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
- `ng-click`
- `ng-dropdown`

### Semantic structure

Place `aside[ng-sidebar]` beside `main` and connect native button triggers with `aria-controls`. The root directive inspects semantic `header`, `nav`, `section`, list, and footer descendants; no child sidebar directives or anatomy classes are required. Author side, variant, and collapse mode on the root. Compose nested disclosure with Collapsible and action menus with Dropdown.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-controls` | Output | ARIA relationship or state. |
| `aria-current` | Output | Current item or date state. |
| `aria-expanded` | Output | Open or expanded state exposed to assistive technology. |
| `aria-hidden` | Output | ARIA relationship or state. |
| `aria-labelledby` | Output | ARIA relationship or state. |
| `collapsed` | Input/output | Authored option or semantic HTML attribute observed by the directive. |
| `collapsible` | Input/output | Authored option or semantic HTML attribute observed by the directive. |
| `data-variant` | Output | Stable component state or styling hook. |
| `dir` | Output | Text and interaction direction: `ltr` or `rtl`. |
| `ng-click` | Input | Authored option or semantic HTML attribute observed by the directive. |
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

Target `[ng-sidebar]`, semantic descendants, component classes, and generated state from Tailwind or ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
