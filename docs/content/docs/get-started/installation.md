---
title: Install AngularCSS
linkTitle: Installation
weight: 20
description:
  Install AngularTS and AngularCSS locally, load the stylesheet, and connect the
  ui module.
---

AngularCSS is distributed as an npm package and requires AngularTS. Install both
packages locally:

```bash
npm install @angular-wave/angular.ts @angular-wave/angular.css
```

No CDN is required. The package includes ESM, UMD, CSS, and TypeScript
declaration outputs.

## Bundler setup

Import AngularTS before AngularCSS so the runtime exists when AngularCSS
registers its directives. Import the compiled stylesheet once in your
application entrypoint:

```ts
import { angular } from '@angular-wave/angular.ts';
import '@angular-wave/angular.css';
import '@angular-wave/angular.css/dist/angular.css';

angular.module('app', ['ui']);
```

Then attach your application module to an HTML root:

```html
<main ng-app="app">
  <button ng-button>Save</button>
</main>
```

The package registers one AngularTS module named `ui`. Your application should
depend on that module; do not register individual AngularCSS directives again.

## Local script setup

Applications without a bundler can copy the two UMD files and the compiled CSS
into their own static asset directory. Serve all three from the same origin:

```html
<link rel="stylesheet" href="/vendor/angularcss/angular.css" />
<script src="/vendor/angular/angular-ts.umd.js"></script>
<script src="/vendor/angularcss/angular-css.umd.js"></script>

<div ng-app="ui">
  <button ng-button>Save</button>
</div>
```

Load AngularTS first. The documentation examples use this local script order and
never fetch runtime code or styles from a CDN.

## Tailwind layer order

When your application compiles Tailwind itself, load Tailwind before AngularCSS
and place application overrides after the component stylesheet:

```css
@import 'tailwindcss';
@import '@angular-wave/angular.css/dist/angular.css';

@layer components {
  [ng-button][variant='outline'] {
    @apply border-slate-300 bg-transparent;
  }
}
```

AngularCSS does not require Tailwind at runtime. The published CSS is already
compiled.

## Verify the installation

Render a button and inspect it in browser developer tools:

```html
<button ng-button variant="secondary">Installed</button>
```

The element should retain `ng-button` and receive mirrored `data-variant` and
`data-size` attributes. If it remains unstyled, verify the CSS import. If state
attributes are missing, verify script order and the `ui` module dependency.

## TypeScript

The package ships declarations under `@types`. TypeScript resolves them from the
package's `types` field; no separate DefinitelyTyped package is needed.

## Next step

[Build your first component]({{< relref
"/docs/get-started/first-component" >}}) with semantic HTML and AngularTS state.
