# Release Workflow

This document describes the process for releasing a new version of the package.

## 1. Development

- The main development branch is `dev`.
- Most of the work (features, fixes) is done directly in the `dev` branch.
- Occasionally, separate branches may be created for larger features, but this is rare.

## 2. Release Preparation

- When enough changes have accumulated in `dev` for a release, a Pull Request is created from `dev` to `main`.
- **Before opening the Pull Request**, generate a PR description using Git Friday:
  ```bash
  friday pr
  ```
  When prompted, enter the git log command to compare branches:
  ```
  ? Enter your custom git log command: git log main..dev
  ```
  This will generate an AI-powered summary of all changes in the PR, which you can use for the PR description.
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

    This command uses `standard-version` under the hood and automatically:
    - Updates the version in `package.json`.
    - Creates a commit with the message `chore(release): vX.X.X`.
    - Creates a Git tag with the new version.

3.  **Push changes to the remote repository:**

    ```bash
    git push origin main --follow-tags
    ```

4.  **Build and publish to npm:**

    ```bash
    pnpm run build
    pnpm publish
    ```

5.  **Create a release on GitHub:**
    - First, generate the changelog using Git Friday:
      ```bash
      friday changelog
      ```
      When prompted, enter the git log command with the previous version tag:
      ```
      ? Enter your custom git log command: git log vX.X.X..HEAD
      ```
      Replace `vX.X.X` with the previous version tag to get all changes since the last release.
    - Go to the "Releases" section of your repository on GitHub.
    - Click "Draft a new release".
    - Select the newly created tag.
    - Use the generated changelog as release notes.
    - Publish the release.
