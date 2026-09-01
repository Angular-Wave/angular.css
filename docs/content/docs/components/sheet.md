---
title: sheet
category: 'overlay'
description: >
  Edge anchored overlay panels
---

Use a native `dialog` and declarative invoker. Author `data-side` on the dialog
as `right`, `left`, `top`, or `bottom`; CSS owns only physical placement.

```html
<section class="sheet">
  <button commandfor="profile-sheet" command="show-modal">Open</button>
  <dialog id="profile-sheet" data-side="right" class="sheet-content">
    <header class="sheet-header">
      <h2 class="sheet-title">Edit profile</h2>
      <p class="sheet-description">Update your account details.</p>
    </header>
    <div class="sheet-body">Content</div>
    <footer class="sheet-footer">
      <button commandfor="profile-sheet" command="close">Close</button>
    </footer>
  </dialog>
</section>
```

## Example

{{< example src="examples/components/sheet.html" title="Profile form sheet" height="420" >}}

The example keeps profile values and save state in AngularTS. Sheet owns only
modal disclosure, semantics, focus, and placement.

## Without Corner Close

{{< example src="examples/components/sheet-no-close.html" title="Sheet without a close button" height="360" >}}

The panel intentionally omits close controls and remains dismissible through the
exact overlay or Escape.

## Sides

{{< example src="examples/components/sheet-sides.html" title="Physical sheet sides" height="420" >}}

Top and bottom panels use a half-viewport maximum in this composition. The
scrolling body remains independent from the header and footer.

## RTL

{{< example src="examples/components/sheet-rtl.html" title="RTL profile sheet" height="420" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This is a styling-only HTML element or pattern. AngularCSS registers no runtime directive for it. A native dialog provides modal behavior; CSS supplies edge placement.

## Anatomy

### Root styling selector

- `.sheet`

### Semantic structure

Use `.sheet` as an optional wrapper, a native invoker button, and `dialog.sheet-content` with authored `data-side`. Close controls use `command=close`; no overlay element is required.

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

A native `dialog` owns modal disclosure, focus, Escape, background isolation, and restoration. Authored `data-side` selects CSS edge placement. AngularTS remains responsible for form values, validation, submission, language, and authored content.

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
