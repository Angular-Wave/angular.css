---
title: calendar
notoc: true
description: >
  Calendar date grid structure
---

Use calendar slots for the header, weekday row, and day cells. Mark selected,
today, and outside-month days with attributes.

```html
<section data-slot="calendar">
  <header data-slot="calendar-header">May 2026</header>
  <div data-slot="calendar-grid">
    <button data-slot="calendar-day" aria-selected="true">14</button>
  </div>
</section>
```

## Example

{{< example src="examples/elements/calendar.html" title="Calendar example" height="470" >}}

<!-- angularcss-element-reference:start -->
## Canonical reference

This element entrypoint re-exports the canonical `calendar` TypeScript
implementation. It does not define separate behavior, state, accessibility, or
CSS APIs.

Read the [complete calendar component reference]({{< relref
"/docs/components/calendar" >}}) for selectors, slots, attributes, generated
state, events, accessibility, and customization.
<!-- angularcss-element-reference:end -->
