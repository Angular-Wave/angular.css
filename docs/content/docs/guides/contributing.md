---
title: Contributing
weight: 60
description:
  Change AngularCSS while preserving its HTML-first ownership and public API
  contracts.
---

Read the repository
[contribution guide](https://github.com/angular-wave/angular.css/blob/master/CONTRIBUTING.md)
before opening a pull request. It defines the HTML, AngularTS, CSS, and
AngularCSS ownership order, local setup, generated documentation workflow, and
public API review process.

For shared presentation changes, update the DTCG 2025.10 source rather than
editing generated token CSS. For catalog changes, keep root classes minimal and
prefer semantic descendants and native attributes. Browser tests must exercise
the built standalone example.

The required local sequence is:

```sh
npm run release:build
npm run check
npm test
```

Keep a pull request focused. Describe the concrete trigger, the resulting
behavior, the public API impact, and the validation performed.
