# Maintainers

This document describes some instructions for maintainers. Other contributors
and users need not be concerned with this material.

### GitHub instructions

When setting up the repository on GitHub, configure the following settings:

- Under `General` → `Pull Requests`, enable
  `Automatically delete head branches`.
- Under `Secrets and variables`:
  - Under `Actions`, add a `DOCKER_PASSWORD` repository secret with an
    appropriate value.
  - Under `Dependabot`, add the `DOCKER_PASSWORD` repository secret from above.
- Under `Branches`, click `Add a branch ruleset` and configure it as follows:
  - For the ruleset name, you can use the name of the branch: `main`.
  - Set `Enforcement status` to `Active`
  - Under `Targets` → `Target branches`, click `Add target` and select
    `Include default branch` from the dropdown menu.
  - Under `Rules` → `Branch rules`, check `Require status checks to pass` and
    configure it as follows before clicking the `Create` button:
    - Enable `Require branches to be up to date before merging`
    - Click the `Add checks` button and add the `Validate` status check (you may
      need to use the search box to find it).
- Under `Pages`, change the `Source` to `GitHub Actions` and check
  `Enforce HTTPS`.

### Release instructions

Follow these steps to release a new version:

1. Bump the version in `[file:manifest.json]` and `[file:package.json]`, run
   `npm install` to update `[file:package-lock.json]`, and update
   `[file:CHANGELOG.md]` with information about the new version. Ship those
   changes as a single commit.
2. Run `toast release` to build the extension. It will produce a file called
   `hashpass.zip`.
3. Upload the ZIP file to the
   [Chrome Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
   and publish the new version.
