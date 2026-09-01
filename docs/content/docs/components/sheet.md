---
title: sheet
category: 'overlay'
description: >
  Edge anchored overlay panels
---

Use one `ng-sheet` root with semantic child elements identified by sheet part
classes. Author `side` on the
root or content as `right`, `left`, `top`, or `bottom`; the directive reflects
the resolved physical viewport edge to `data-side`.

```html
<section ng-sheet side="right">
  <button class="sheet-trigger">Open</button>
  <div class="sheet-overlay"></div>
  <dialog class="sheet-content">
    <header class="sheet-header">
      <h2 class="sheet-title">Edit profile</h2>
      <p class="sheet-description">Update your account details.</p>
    </header>
    <div class="sheet-body">Content</div>
    <footer class="sheet-footer">
      <button data-sheet-close>Close</button>
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

This component's root directive is `[ng-sheet]`. Importing the package registers it with the AngularCSS `ui` module; there is no per-component JavaScript registration step.

## Anatomy

### Directive selectors

- `ng-sheet`

### Semantic structure

A sheet root requires one native button trigger, one overlay, and one native dialog content element. The root directive inspects descendants through sheet part classes; no child directives are required. Use `side` for placement. Title, description, header, body, and footer are optional.

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

`Input` attributes are read from authored HTML. `Output` attributes are maintained by AngularCSS for CSS and testing. `Input/output` attributes may be authored for a controlled initial state and are then synchronized by the directive.

### CSS custom properties

This directive does not write component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

The directive owns modal disclosure, physical side reflection, direct-child ownership, focus containment, Escape and exact-overlay dismissal, background isolation, document scroll locking, and focus restoration. AngularTS remains responsible for form values, validation, submission, language, authored content, and controlled application state.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Use a visible title and description. The trigger exposes dialog popup, controls, and expanded relationships; content receives dialog, modal, labelled-by, described-by, hidden, physical side, direction, and focusability state. While open, background branches are inert, focus remains contained, Escape or the exact overlay dismisses, and focus returns to the invoking trigger.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target `[ng-sheet]`, semantic descendants, component classes, and generated state from Tailwind or ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
