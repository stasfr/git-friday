# Git Friday

An intelligent CLI tool that uses AI to analyze git commits and generate a clear, human-readable report. It helps team leads and managers quickly understand the progress made by developers without digging through technical commit logs.

## Docs links

- [Release Workflow](./docs/release-workflow.en.md) - how do I release a new version of the project?
- [TODO](./docs/TODO.md) - list of current tasks and plans for project development.

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

Before running, you need to set up the following:

#### 1. Environment Variables

Create a `.env` file in the root of your repository with the following variables:

- `OPENAI_BASE_URL`: The base URL for the OpenAI-compatible API endpoint (e.g., `https://openrouter.ai/api/v1` for OpenRouter).
- `OPENAI_API_KEY`: Your API key for the AI service.

#### 2. Application Configuration

Git Friday uses a file-based configuration system. Before using the tool, you need to initialize the configuration:

```bash
friday config init
```

Then set the required configuration values:

- `aiCompletionModel`: The identifier of the AI model you want to use (e.g., `mistralai/mistral-7b-instruct`, `openai/gpt-4o`).
- `appLocalization`: (Optional) The language for the application interface. Supported values are `en` (English) and `ru` (Russian). Defaults to `ru` if not specified.

```bash
friday config set aiCompletionModel "openai/gpt-4o"
friday config set appLocalization "en"
```

The tool will not work without the required environment variables and configuration values defined.

### Available Commands

Git Friday provides several commands to generate different types of content based on your git history.

---

#### `config`

Manage application configuration settings.

##### `config init`

Initialize configuration settings for the application. This creates the configuration file with default empty values.

```bash
friday config init
```

##### `config set`

Set a specific configuration value.

**Arguments:**

- `<key>`: Configuration key to set (e.g., `aiCompletionModel`, `appLocalization`).
- `<value>`: Value to set for the key.

**Examples:**

```bash
friday config set aiCompletionModel "anthropic/claude-3.5-sonnet"
friday config set appLocalization "ru"
```

---

#### `report`

Generates a daily activity report based on git commits.

**Options:**

- `-a, --authors <authors...>`: (Optional) A space-separated list of Git authors whose commits you want to analyze. If not provided, commits from all authors will be included. Cannot be used with `--current-user`.
- `-b, --branches <branches...>`: (Optional) A space-separated list of branches to include in the analysis.
- `--all`: (Optional) Include all branches in the analysis. Defaults to `false`.
- `--today`: (Optional) Filter commits by today. Cannot be used with `--since` or `--until`.
- `--since <date>`: (Optional) Filter commits starting from a specific date (e.g., "2023-01-01" or "yesterday"). Cannot be used with `--today`.
- `--until <date>`: (Optional) Filter commits up to a specific date (e.g., "2023-01-01" or "today"). Cannot be used with `--today`.
- `--current-user`: (Optional) A flag to filter commits by your current Git `user.email`. Cannot be used with `--authors`.
- `-r, --range <range>`: (Optional) Revision range for commits (e.g., `main..dev`, `HEAD~5..HEAD`).
- `--since-ref <ref>`: (Optional) Get commits after a specific tag or ref (e.g., `v0.13.0`).

**Examples:**

To generate a report for commits made by `s.farkash` and `stas_fr` in the `dev` and `main` branches:

```bash
friday report -a s.farkash stas_fr -b dev main
```

To generate a report for your own commits across all branches:

```bash
friday report --current-user --all
```

To generate a report for today's commits:

```bash
friday report --today
```

To generate a report for commits from a specific date range:

```bash
friday report --since "2023-01-01" --until "2023-01-07"
```

To generate a report for commits from a relative date (supports formats like "yesterday", "1 day ago", etc.):

```bash
friday report --since "yesterday"
```

To generate a report using a revision range:

```bash
friday report -r "main..dev"
friday report -r "HEAD~5..HEAD"
```

To generate a report for commits since a specific tag:

```bash
friday report --since-ref "v0.13.0"
```

---

#### `pr`

Generate a PR (Pull Request) report based on commit history within pull requests.

**Options:**

- `-r, --range <range>`: (Required) Revision range for commits (e.g., `main..dev`, `HEAD~5..HEAD`).

**Examples:**

To generate a PR report comparing the `dev` branch against `main`:

```bash
friday pr -r "main..dev"
```

To generate a PR report for the last 10 commits:

```bash
friday pr -r "HEAD~10..HEAD"
```

To generate a PR report comparing two specific branches:

```bash
friday pr -r "origin/main..feature/new-feature"
```

---

#### `changelog`

Generate a changelog from git commits since a specific tag or reference.

**Options:**

- `--since-ref <ref>`: (Required) Get commits after a specific tag or ref (e.g., `v0.13.0`).

**Examples:**

To generate a changelog for all commits since version 0.13.0:

```bash
friday changelog --since-ref "v0.13.0"
```

To generate a changelog since a specific commit:

```bash
friday changelog --since-ref "abc1234"
```

To generate a changelog since a branch point:

```bash
friday changelog --since-ref "main"
```

---

### Output Statistics

After generating any report, Git Friday displays usage statistics:

- **Token Usage**: Shows the number of tokens used for the prompt, completion, and the total tokens consumed during AI processing.
- **Cost Summary**: If you're using OpenRouter or another provider that supports cost reporting, a cost summary will be displayed showing the total cost of the API request in USD.
