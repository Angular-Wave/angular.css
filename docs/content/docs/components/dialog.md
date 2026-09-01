---
title: dialog
category: 'overlay'
description: >
  Modal dialog structure
---

Compose a modal from semantic trigger, overlay, content, header, footer, title,
and description selectors. AngularCSS owns disclosure and modal focus behavior;
AngularTS owns form values and application actions inside the dialog.

```html
<section ng-dialog>
  <button class="dialog-trigger">Edit profile</button>
  <div class="dialog-overlay"></div>
  <dialog class="dialog-content">
    <header class="dialog-header">
      <h2 class="dialog-title">Edit profile</h2>
      <p class="dialog-description">Update your public profile.</p>
    </header>
    <button data-dialog-close>Save changes</button>
  </dialog>
</section>
```

## Profile Dialog

## Example

{{< example src="examples/components/dialog.html" title="Dialog example" height="420" >}}

## Close Controls

Corner and footer close actions are distinct, and the corner control can be
omitted without changing modal behavior.

{{< example src="examples/components/dialog-close-workflows.html" title="Dialog close controls" height="480" >}}

## Scrolling

Use `.dialog-body` for independently scrollable content. Keep the footer
outside that body when its actions must remain visible.

{{< example src="examples/components/dialog-scroll-workflows.html" title="Scrollable dialogs" height="480" >}}

## Right To Left

{{< example src="examples/components/dialog-rtl.html" title="Right-to-left dialog" height="420" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This component's root directive is `[ng-dialog]`. Importing the package registers it with the AngularCSS `ui` module; there is no per-component JavaScript registration step.

## Anatomy

### Directive selectors

- `ng-dialog`

### Semantic structure

A dialog root requires one native button trigger, one overlay, and one native dialog content element. The root directive inspects descendants through dialog part classes; no child directives are required. Title and description are strongly recommended; header, body, and footer are optional.

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
| `data-state` | Output | Stable component state or styling hook. |
| `dir` | Input | Text and interaction direction: `ltr` or `rtl`. |
| `disabled` | Input | Disables native or component interaction. |
| `hidden` | Output | Authored option or semantic HTML attribute observed by the directive. |
| `role` | Output | Explicit semantic role when native HTML does not provide one. |
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

The directive owns modal disclosure, directly owned trigger and content relationships, initial focus, Tab containment, focus-in containment, Escape and overlay dismissal, background inertness, document scroll locking, controlled `data-open` state, direction reflection, and trigger focus restoration. AngularTS remains responsible for form models, validation, submission, authored content, and application state.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Use a visible title and description. The trigger is connected to content with `aria-controls` and expanded state; content receives dialog, modal, labelled-by, described-by, hidden, and focusability semantics. While open, focus remains in the topmost dialog, background branches are inert, Escape dismisses, and focus returns to the invoking trigger.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target `[ng-dialog]`, semantic descendants, component classes, and generated state from Tailwind or ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
