# Release procedure

AngularCSS publishes one npm package and a matching GitHub release from a
version tag. The release workflow builds and publishes the exact tarball that
passed the release checks.

## First npm release

The npm package does not exist until version `0.0.1` is published. Add an npm
automation or granular access token with permission to create and publish
`@angular-wave/angular.css` as the `NPM_TOKEN` GitHub Actions secret.

After the first release:

1. Configure npm trusted publishing for repository
   `angular-wave/angular.css` and workflow `.github/workflows/release.yml`.
2. Remove the `NPM_TOKEN` secret.

Future releases then authenticate through GitHub Actions OIDC. Both paths
publish npm provenance.

## Prepare a release

Record user-visible changes under `Unreleased` in `CHANGELOG.md`, update the
version in `package.json`, `package-lock.json`, and `docs/hugo.yaml`, then add a
dated changelog section for that version.

Run the complete local gate:

```bash
npm ci
npm run release:build
npm run check
npm test
npm run test:docs
```

Inspect the exact package contents:

```bash
mkdir -p release
npm pack --ignore-scripts --dry-run --json > release/npm-pack.json
node scripts/release.mjs verify-pack release/npm-pack.json
```

Commit and push the prepared release. Do not bypass the repository checks.

## Publish

Create and push a tag that exactly matches `v<package.version>`:

```bash
git tag -a v0.0.1 -m "AngularCSS 0.0.1"
git push origin v0.0.1
```

The tag starts `.github/workflows/release.yml`. The workflow:

1. Runs the complete reusable CI workflow against the tagged commit.
2. Validates the tag, package metadata, changelog, and registry state.
3. Rebuilds declarations, JavaScript, CSS, and documentation artifacts.
4. Verifies the exact npm package contents.
5. Creates a draft GitHub release with curated changelog notes.
6. Publishes the tarball to npm with provenance.
7. Publishes the GitHub release only after npm succeeds.

The release is complete when the Release workflow is green and both npm and
GitHub expose version `0.0.1`.

## Recover a partial release

Rerun a failed job first when the failure is transient. If npm publication
succeeded but the GitHub release did not, manually dispatch the Release
workflow with the existing tag. The recovery path verifies the immutable npm
version, skips republishing it, and finishes the GitHub release.

Never move a published tag or overwrite an npm version. Prepare a new patch
version for corrections.
