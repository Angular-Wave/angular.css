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
directives or mirror native state into `data-*` attributes. Composite widgets
such as dialogs, comboboxes, and calendars retain focused TypeScript behavior
for focus management, keyboard navigation, and coordinated disclosure.

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
