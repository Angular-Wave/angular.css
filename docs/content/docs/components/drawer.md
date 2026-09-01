---
title: drawer
category: 'overlay'
description: >
  Bottom anchored drawer panels
---

Drawers are native modal dialogs with CSS edge placement and optional handle,
header, scroll body, and footer. AngularTS owns values and actions inside them.

```html
<section class="drawer">
  <button commandfor="goal-drawer" command="show-modal">Open Drawer</button>
  <dialog id="goal-drawer" data-side="bottom" class="drawer-content">
    <div class="drawer-handle"></div>
    <h2 class="drawer-title">Move Goal</h2>
    <p class="drawer-description">Set your daily activity goal.</p>
    <button commandfor="goal-drawer" command="close">Cancel</button>
  </dialog>
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

This is a styling-only HTML element or pattern. AngularCSS registers no runtime directive for it. A native dialog provides modal behavior; CSS supplies edge placement.

## Anatomy

### Root styling selector

- `.drawer`

### Semantic structure

Use `.drawer` as an optional wrapper, a native invoker button, and `dialog.drawer-content` with authored `data-side`. Close controls use `command=close`; no overlay element is required.

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

Attributes remain authored HTML, native state, or AngularTS inputs. AngularCSS does not write element state.

### CSS custom properties

This styling hook does not define component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

A native `dialog` owns modal disclosure, focus, Escape, background isolation, and restoration. Authored `data-side` selects CSS edge placement. AngularTS remains responsible for form models, goal values, validation, submission, responsive application composition, and authored content.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Use a visible title and description connected to the native dialog. Keep the physical edge as presentation only; content order, focus order, and inherited text direction remain semantic.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target semantic elements, native state selectors, and component classes from Tailwind or ordinary CSS. Behavior and accessible state remain with native HTML and AngularTS; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
