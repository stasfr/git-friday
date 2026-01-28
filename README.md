# Git Friday

An intelligent CLI tool that uses AI to analyze git commits and generate a clear, human-readable report. It helps team leads and managers quickly understand the progress made by developers without digging through technical commit logs.

[TODO](./TODO.md) - list of current tasks and plans for project development.

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

Before running, you need to create a `.env` file in the root of your repository. This file must contain the following variables:

- `OPEN_ROUTER_API_KEY`: Your API key for the OpenRouter service.
- `AI_COMPLETION_MODEL`: The identifier of the AI model you want to use (e.g., `mistralai/mistral-7b-instruct`).
- `APP_LOCALIZATION`: (Optional) The language for the application interface. Supported values are `en` (English) and `ru` (Russian). Defaults to `ru` if not specified.

The tool will not work without the required variables defined.

### Available Commands

Git Friday provides several commands to generate different types of content based on your git history.

#### `report`

Generates a daily activity report based on today's commits.

**Options:**

- `-a, --authors <authors...>`: (Optional) A space-separated list of Git authors whose commits you want to analyze. If not provided, commits from all authors will be included.
- `-b, --branches <branches...>`: (Optional) A space-separated list of branches to include in the analysis. If not provided, all branches will be analyzed.
- `--since <date>`: (Optional) Filter commits starting from a specific date (e.g., "2023-01-01" or "yesterday").
- `--until <date>`: (Optional) Filter commits up to a specific date (e.g., "2023-01-01" or "today").
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

To generate a report for commits from a specific date range:

```bash
friday report --since "2023-01-01" --until "2023-01-07"
```

To generate a report for commits from a relative date (supports formats like "yesterday", "1 day ago", etc.):

```bash
friday report --since "yesterday"
```

To generate a report for today's commits:

```bash
friday report
```

After generating the report, Git Friday will also display token usage statistics showing the number of tokens used for the prompt, completion, and the total tokens consumed during the AI processing.

## Workflow

- [Release Workflow (EN)](./docs/release-workflow.en.md)
- [Release Workflow (RU)](./docs/release-workflow.ru.md)
