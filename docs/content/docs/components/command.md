---
title: command
category: 'command palette'
description: >
  Command palette layout
---

Build a searchable command menu from semantic `ng-command-*` attributes.
AngularTS owns query filtering and command execution. Command follows the
rendered result DOM and supplies listbox relationships, active-descendant
navigation, disabled skipping, and scroll-to-active behavior.

```html
<section ng-command data-variant="surface" aria-label="Command menu">
  <div ng-command-input-wrapper>
    <div ng-command-input-group>
      <span ng-command-input-icon aria-hidden="true"><!-- search icon --></span>
      <input
        ng-command-input
        aria-label="Search commands"
        ng-model="query"
        placeholder="Type a command or search..."
      />
    </div>
  </div>
  <div ng-command-list>
    <p ng-command-empty>No results found.</p>
    <section ng-command-group>
      <h2 ng-command-group-heading>Suggestions</h2>
      <div
        ng-command-item
        ng-repeat="command in commands | filter:query"
        ng-click="selected=command.label"
      >
        <span ng-bind="command.label"></span>
        <span ng-command-shortcut ng-bind="command.shortcut"></span>
      </div>
    </section>
  </div>
</section>
```

Use `aria-disabled="true"` or native `disabled` state for unavailable options.
Arrow keys wrap through enabled rendered options; Home and End move to the
boundaries; Enter activates the current option through its ordinary click
handler. Pointer movement updates the same active state.

For a modal palette, place `ng-command` directly inside `ng-dialog-content`. Use
the existing Dialog trigger and `data-dialog-close` behavior hooks instead of
reproducing modal focus, Escape, outside-dismissal, or focus-restoration logic
in Command. Application shortcuts such as Ctrl J remain AngularTS `ng-keydown`
expressions.

## Example

{{< example src="examples/components/command.html" title="Command example" height="390" >}}

## Dialog Workflows

Basic, grouped, shortcut-label, and application-owned Ctrl J dialog references
are functional packaged examples.

{{< example src="examples/components/command-dialog-workflows.html" title="Command dialog workflows" height="980" >}}

## Scrollable

The full 23-item reference inventory demonstrates the 288px list constraint,
keyboard scroll-to-active behavior, filtering, and selection.

{{< example src="examples/components/command-scrollable.html" title="Scrollable command" height="700" >}}

## RTL

Logical icon, text, shortcut, active-item, and keyboard order are preserved in
an Arabic command surface.

{{< example src="examples/components/command-rtl.html" title="RTL command" height="520" >}}

<!-- angularcss-reference:start -->
## Installation

Install AngularCSS once, load its stylesheet, and include the `ui` module in
your AngularTS application. See [Installation]({{< relref
"/docs/get-started/installation" >}}) for the complete setup.

This component's root directive is `[ng-command]`. Importing the package registers it with the AngularCSS `ui` module; there is no per-component JavaScript registration step.

## Anatomy

### Directive selectors

- `ng-command`
- `ng-command-empty`
- `ng-command-group`
- `ng-command-group-heading`
- `ng-command-input`
- `ng-command-item`
- `ng-command-list`
- `ng-command-separator`
- `ng-command-shortcut`

### Styling slots

- `[data-slot="command"]`
- `[data-slot="command-empty"]`
- `[data-slot="command-group"]`
- `[data-slot="command-group-heading"]`
- `[data-slot="command-input"]`
- `[data-slot="command-input-group"]`
- `[data-slot="command-input-icon"]`
- `[data-slot="command-input-wrapper"]`
- `[data-slot="command-item"]`
- `[data-slot="command-item-icon"]`
- `[data-slot="command-list"]`
- `[data-slot="command-separator"]`
- `[data-slot="command-shortcut"]`
- `[data-slot="dialog-content"]`

A command root requires one input and one list. Empty state, labeled groups, separators, item icons, and shortcuts are optional composition primitives. Prefer semantic `ng-command-*` attributes when AngularCSS supplies behavior and styling; use `data-slot` only as a styling hook when behavior is supplied elsewhere, and never duplicate both on one element. Compose modal palettes from the existing Dialog primitives and use `data-dialog-close` when an option should close that dialog without acquiring Dialog close-button styling.
Use the named slots as stable Tailwind and CSS selectors.

## API

### Attributes and state

| Attribute | Access | Purpose |
| --- | --- | --- |
| `aria-activedescendant` | Output | ARIA relationship or state. |
| `aria-autocomplete` | Input/output | ARIA relationship or state. |
| `aria-controls` | Output | ARIA relationship or state. |
| `aria-disabled` | Input/output | Semantic disabled state. |
| `aria-expanded` | Output | Open or expanded state exposed to assistive technology. |
| `aria-hidden` | Input/output | ARIA relationship or state. |
| `aria-labelledby` | Output | ARIA relationship or state. |
| `aria-orientation` | Output | ARIA relationship or state. |
| `aria-selected` | Input/output | Selected item state. |
| `data-direction` | Output | Stable component state or styling hook. |
| `data-disabled` | Output | Stable component state or styling hook. |
| `data-empty` | Output | Stable component state or styling hook. |
| `data-selected` | Input/output | Stable component state or styling hook. |
| `data-visible` | Output | Stable component state or styling hook. |
| `dir` | Input | Text and interaction direction: `ltr` or `rtl`. |
| `disabled` | Input | Disables native or component interaction. |
| `hidden` | Input | Authored option or semantic HTML attribute observed by the directive. |
| `role` | Output | Explicit semantic role when native HTML does not provide one. |
| `tabindex` | Output | Keyboard focus order for composite descendants. |

`Input` attributes are read from authored HTML. `Output` attributes are maintained by AngularCSS for CSS and testing. `Input/output` attributes may be authored for a controlled initial state and are then synchronized by the directive.

### CSS custom properties

This directive does not write component-specific CSS custom properties.

### DOM events

This component does not emit a component-specific custom event.

Native DOM events continue to work normally. AngularTS event directives such as
`ng-click` and `ng-keydown`, plus the `data-change` model callback, remain application-owned.

## Behavior

The directive follows the application-rendered result DOM and owns active-descendant navigation, enabled-option wrapping and boundaries, pointer synchronization, Enter activation through the authored click handler, semantic group and empty state, and scroll-to-active behavior. AngularTS remains responsible for query filtering, command execution, result data, structural bindings, and application keyboard shortcuts. Dialog remains responsible for modal disclosure, focus trapping, Escape, outside dismissal, and focus restoration.

AngularCSS does not replace AngularTS interpolation, bindings, structural
directives, form controllers, validation, or application state.

## Accessibility

Give the search input and command surface useful accessible names. The input is connected to a listbox through `aria-controls` and `aria-activedescendant`; rendered options expose selected and disabled state, labeled groups retain group relationships, separators are decorative structure, and shortcut labels are hidden from repeated announcement. A modal composition must include an accessible Dialog title and description.

Authored accessible names and relationships are preserved. Test the final
composition with keyboard navigation and assistive technology because labels and
content come from the application.

## Customization

Target `[ng-command]`, the documented `data-slot` selectors, and generated `data-*` states from Tailwind or ordinary CSS. Keep behavior and accessible state in the TypeScript directive; visual choices belong in the application stylesheet.

Read [Styling with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}) for layer order, design tokens, state
variants, and iframe demo isolation.
<!-- angularcss-reference:end -->
