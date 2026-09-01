---
title: Build Your First Component
linkTitle: First component
weight: 30
description:
  Build an interactive accordion and connect ordinary AngularTS state inside it.
---

This page builds an accordion with native headings and buttons. AngularCSS owns
the disclosure interaction; AngularTS owns the application value inside the
panel.

## Add the HTML

```html
<section ng-app="app">
  <div ng-accordion>
    <article>
      <h2>
        <button type="button">Profile</button>
      </h2>
      <div>
        <label for="display-name">Display name</label>
        <input id="display-name" ng-model="profile.name" class="input" />
        <output>Preview: {{ profile.name || "Unnamed" }}</output>
      </div>
    </article>
  </div>
</section>
```

The direct accordion children are items. Each item contains a heading button
followed by its panel. The directive creates trigger-panel relationships and
synchronizes expanded, hidden, open, and focus state.

## Create the application module

```ts
import { angular } from '@angular-wave/angular.ts';
import '@angular-wave/angular.css';
import '@angular-wave/angular.css/dist/angular.css';

angular.module('app', ['ui']);
```

No controller is required for this example. `ng-model` creates the profile name
binding in the application scope, and interpolation updates the preview.
AngularCSS does not parse or store that value.

## Test the result

1. Press Tab until the accordion trigger receives focus.
2. Press Enter or Space to open and close the panel.
3. Enter a display name and confirm the preview updates.
4. Inspect the trigger's `aria-expanded` and the panel's `data-open` state.

## Add multiple panels

Add another sibling item inside `[ng-accordion]`. By default, opening it closes
the current item. Add `multiple` to the root when several panels may remain
open:

```html
<div ng-accordion multiple>...</div>
```

## Next step

[Style components with Tailwind]({{< relref
"/docs/get-started/styling-tailwind" >}}), then browse the [complete accordion
reference]({{< relref "/docs/components/accordion" >}}).
