# Release Workflow

This document describes the process for releasing a new version of the package.

## 1. Development

- The main development branch is `dev`.
- All new features and fixes are done in separate branches created from `dev`.
- After work on a feature or fix is complete, the changes are merged into the `dev` branch.

## 2. Release Preparation

- When enough changes have accumulated in `dev` for a release, a Pull Request is created from `dev` to `main`.
- After review and approval, the Pull Request is merged into `main`. This creates a merge commit that contains all the changes from `dev`.

## 3. Release

1.  **Switch to the `main` branch:**
    ```bash
    git checkout main
    git pull origin main
    ```

2.  **Run the release script:**
    Depending on the type of changes (patch, minor, or major), run one of the following commands:

    - **Patch release (bug fixes):**
      ```bash
      pnpm run release:patch
      ```
    - **Minor release (new functionality):**
      ```bash
      pnpm run release:minor
      ```
    - **Major release (breaking changes):**
      ```bash
      pnpm run release:major
      ```
    This command automatically:
    - Updates the version in `package.json`.
    - Creates a commit with the message `chore(release): publish vX.X.X`.
    - Creates a Git tag with the new version.
    - Pushes the commit and tag to the remote repository.
    - Builds the project.
    - Publishes the new version to npm.

3.  **Create a release on GitHub:**
    - Go to the "Releases" section of your repository on GitHub.
    - Click "Draft a new release".
    - Select the newly created tag.
    - Generate or write release notes.
    - Publish the release.
