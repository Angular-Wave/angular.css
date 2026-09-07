# Documentation contributions

The documentation is part of the AngularCSS release and follows the repository
[contribution guide](../CONTRIBUTING.md).

Install the root and documentation dependencies, build generated assets, and run
the documentation suite before submitting a change:

```sh
npm install
npm --prefix docs install
npm run release:build
npm run test:docs
```

Component reference sections are generated from canonical source. Edit the
source under `src/`, then run `npm run generate-docs:components` and
`npm run sync:catalog-examples`. Edit prose outside the generated reference
markers directly.
