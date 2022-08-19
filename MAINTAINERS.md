# Maintainers

This document describes some instructions for maintainers. Other contributors
and users need not be concerned with this material.

### GitHub instructions

When setting up the repository on GitHub, configure the following settings:

- Under `Secrets`:
  - Under `Actions`, add the `DOCKER_PASSWORD` repository secret with an
    appropriate value.
  - Under `Dependabot`, add the `DOCKER_PASSWORD` repository secret with an
    appropriate value (e.g., that of the corresponding secret above).
- Under `Branches`, add a branch protection rule for the `main` branch.
  - Enable `Require status checks to pass before merging`.
    - Enable `Require branches to be up to date before merging`.
    - Add the `Validate` status check.
  - Enable `Include administrators`.
- Under `Options`, enable `Automatically delete head branches`.

### Release instructions

Follow these steps to release a new version:

1. Bump the version in `manifest.json` and `package.json`, run `npm install` to
   update `package-lock.json`, and update `CHANGELOG.md` with information about
   the new version. Ship those changes as a single commit.
2. Run `toast release` to build the extension. It will produce a file called
   `hashpass.zip`.
3. Upload the ZIP file to the
   [Chrome Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
   and publish the new version.
