---
title: drawer
category: 'overlay'
description: >
  Bottom anchored drawer panels
---

Drawers are modal edge panels with a trigger, overlay, content, and optional
handle, header, scroll body, and footer. AngularCSS owns modal disclosure and
side geometry; AngularTS owns values and actions inside the panel.

```html
<section ng-drawer side="bottom">
  <button ng-drawer-trigger>Open Drawer</button>
  <div ng-drawer-overlay></div>
  <section ng-drawer-content>
    <div ng-drawer-handle></div>
    <h2 ng-drawer-title>Move Goal</h2>
    <p ng-drawer-description>Set your daily activity goal.</p>
    <button ng-drawer-close>Cancel</button>
  </section>
</section>
```

## Activity Goal

## Example

{{< example src="examples/components/drawer.html" title="Drawer example" height="460" >}}

## Responsive Dialog

The application chooses Dialog on desktop and Drawer on compact viewports while
sharing the same AngularTS form model.

{{< example src="examples/components/drawer-dialog.html" title="Responsive dialog and drawer" height="480" >}}

## Sides

{{< example src="examples/components/drawer-sides.html" title="Drawer sides" height="480" >}}

## Scrollable Content

{{< example src="examples/components/drawer-scrollable.html" title="Scrollable drawer content" height="480" >}}

## Right To Left

{{< example src="examples/components/drawer-rtl.html" title="Right-to-left drawer" height="460" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This component's root directive is `[ng-drawer]`. Importing the package registers it with the AngularCSS `ui` module; there is no per-component JavaScript registration step.

## Anatomy

### Directive selectors

- `ng-drawer`
- `ng-drawer-close`
- `ng-drawer-content`
- `ng-drawer-description`
- `ng-drawer-overlay`
- `ng-drawer-title`
- `ng-drawer-trigger`

### Styling slots

- `[data-slot="drawer"]`
- `[data-slot="drawer-close"]`
- `[data-slot="drawer-content"]`
- `[data-slot="drawer-description"]`
- `[data-slot="drawer-handle"]`
- `[data-slot="drawer-header"]`
- `[data-slot="drawer-overlay"]`
- `[data-slot="drawer-title"]`
- `[data-slot="drawer-trigger"]`

A drawer root requires one native button trigger, one overlay, and one content element. Use `side` or `direction` on the root for `bottom`, `top`, `left`, or `right`; bottom is the default. Title and description are strongly recommended; handle, header, body, and footer are optional layout selectors. Prefer semantic `ng-drawer-*` attributes and do not duplicate them with `data-slot`. AngularTS owns all values and application actions inside the drawer.
Use the named slots as stable Tailwind and CSS selectors.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-controls` | Output | ARIA relationship or state. |
| `aria-describedby` | Output | ARIA relationship or state. |
| `aria-expanded` | Output | Open or expanded state exposed to assistive technology. |
| `aria-haspopup` | Output | ARIA relationship or state. |
| `aria-hidden` | Output | ARIA relationship or state. |
| `aria-labelledby` | Output | ARIA relationship or state. |
| `aria-modal` | Output | ARIA relationship or state. |
| `data-direction` | Output | Stable component state or styling hook. |
| `data-open` | Input/output | Stable component state or styling hook. |
| `data-side` | Output | Stable component state or styling hook. |
| `data-state` | Output | Stable component state or styling hook. |
| `dir` | Input | Text and interaction direction: `ltr` or `rtl`. |
| `direction` | Input | Authored option or semantic HTML attribute observed by the directive. |
| `disabled` | Input | Disables native or component interaction. |
| `hidden` | Output | Authored option or semantic HTML attribute observed by the directive. |
| `role` | Output | Explicit semantic role when native HTML does not provide one. |
| `side` | Input | Physical placement: `left`, `top`, `bottom`, or `right`. |
| `tabindex` | Output | Keyboard focus order for composite descendants. |
| `type` | Output | Component or native behavior variant. |

`Input` attributes are read from authored HTML. `Output` attributes are maintained by AngularCSS for CSS and testing. `Input/output` attributes may be authored for a controlled initial state and are then synchronized by the directive.

### CSS custom properties

This directive does not write component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

The directive owns modal disclosure, direct-root trigger and content relationships, bottom, top, left, or right side reflection, initial focus, focus containment, Escape and overlay dismissal, background inertness, document scroll locking, controlled `data-open` state, text direction, and trigger focus restoration. AngularTS remains responsible for form models, goal values, validation, submission, responsive application composition, and authored content.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Use a visible title and description. The trigger exposes dialog popup, controls, and expanded relationships; content receives dialog, modal, labelled-by, described-by, hidden, side, direction, and focusability state. While open, background branches are inert, focus remains contained, Escape dismisses, and focus returns to the invoking trigger.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target `[ng-drawer]`, the documented `data-slot` selectors, and generated `data-*` states from Tailwind or ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
