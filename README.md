# Git Friday

An intelligent CLI tool that uses AI to analyze git commits and generate a clear, human-readable report. It helps team leads and managers quickly understand the progress made by developers without digging through technical commit logs.

## Installation

You can install Git Friday globally using your preferred package manager:

### npm

```bash
npm install -g git-friday
```

### pnpm

```bash
pnpm add -g git-friday
```

### yarn

```bash
yarn global add git-friday
```

## Usage

To use the utility, you must be inside a Git repository.

### Prerequisites

Before running, you need to create a `.env` file in the root of your repository. This file must contain the following two variables:

- `OPEN_ROUTER_API_KEY`: Your API key for the OpenRouter service.
- `AI_COMPLETION_MODEL`: The identifier of the AI model you want to use (e.g., `mistralai/mistral-7b-instruct`).
- `JSONDB_PATH`: The path to the directory where the JSON database file (`db.json`) will be stored.

The tool will not work without these variables defined.

### Available Commands

Git Friday provides several commands to generate different types of content based on your git history.

#### `report`

Generates a daily activity report based on today's commits.

**Options:**

- `-a, --authors <authors...>`: (Optional) A space-separated list of Git authors whose commits you want to analyze. If not provided, commits from all authors will be included.
- `-b, --branches <branches...>`: (Optional) A space-separated list of branches to include in the analysis. If not provided, all branches will be analyzed.
- `--current-user`: (Optional) A flag to filter commits by your current Git `user.email`. This option cannot be used with `--authors`.

**Examples:**

To generate a report for commits made by `s.farkash` and `stas_fr` in the `dev` and `main` branches:

```bash
friday report -a s.farkash stas_fr -b dev main
```

To generate a report for your own commits across all branches:

```bash
friday report --current-user
```

#### `changelog`

Generates a changelog from git commits since a specific tag.

**Options:**

- `--since-tag <tag>`: (Required) The git tag to generate the changelog from.

**Example:**

To generate a changelog for all commits since version `v1.0.0`:

```bash
friday changelog --since-tag v1.0.0
```

#### `pr`

Generates a pull request description by comparing two branches.

**Options:**

- `-b, --branches <branches>`: (Required) The branches to compare, in `target..source` format (e.g., `main..develop`).

**Example:**

To generate a pull request description for changes from the `develop` branch to be merged into `main`:

```bash
friday pr -b main..develop
```

## Workflow

- [Release Workflow (EN)](./docs/release-workflow.en.md)
- [Release Workflow (RU)](./docs/release-workflow.ru.md)
