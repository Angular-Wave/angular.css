# AngularCSS

AngularCSS is an HTML-first style and component layer for AngularTS. Native
HTML owns semantics and browser behavior, AngularTS owns application state, and
AngularCSS adds TypeScript only for interactions those layers cannot provide.

```html
<button class="button" variant="outline">Save changes</button>

<label for="email">Email</label>
<input id="email" class="input" type="email" ng-model="profile.email" />
```

The button and input are styling-only entries. They do not register AngularCSS
directives or mirror native state into `data-*` attributes. Native dialogs and
details disclosures also keep their browser behavior. Composite widgets such as
comboboxes, calendars, and tabs retain focused TypeScript behavior for keyboard
navigation, focus management, and coordinated interaction.

## Installation

```shell
npm install @angular-wave/angular.ts @angular-wave/angular.css
```

Import the stylesheet and register the AngularCSS module with the application:

```js
import "@angular-wave/angular.css/angular.css";
import { angularCssModuleName } from "@angular-wave/angular.css";
import { angular } from "@angular-wave/angular.ts";

angular.createModule("app", [angularCssModuleName]);
```

The UMD bundle registers `angular.css` automatically when AngularTS is already
available on `globalThis.angular`. ESM consumers can call `registerAngularCss()`
explicitly when they use a separate AngularTS runtime.

## Development

```shell
npm install
npm run check
npm test
```

The default developer catalog is `index.html`; every entry links to a
standalone functional HTML example. The canonical HTML-first classification is
maintained in `scripts/component-policy.ts` and enforced by
`npm run check:component-registry`.
