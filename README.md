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

*   `OPEN_ROUTER_API_KEY`: Your API key for the OpenRouter service.
*   `AI_COMPLETION_MODEL`: The identifier of the AI model you want to use (e.g., `mistralai/mistral-7b-instruct`).
*   `JSONDB_PATH`: The path to the directory where the JSON database file (`db.json`) will be stored.

The tool will not work without these variables defined.

### Generating a Report

The main command is `report`. It accepts the following parameters:

*   `-a, --authors <authors...>`: (Optional) A space-separated list of Git authors whose commits you want to analyze. If not provided, commits from all authors will be included.
*   `-b, --branches <branches...>`: (Optional) A space-separated list of branches to include in the analysis. If not provided, all branches will be analyzed.
*   `--current-user`: (Optional) A flag to filter commits by your current Git `user.email`. This option cannot be used with `--authors`.

### Example

Here is an example of how to run the command:

```bash
friday report -a s.farkash stas_fr -b dev main
```

This command will search for all commits made today by the authors `s.farkash` and `stas_fr` within the `dev` and `main` branches, and then generate a consolidated report based on them.

To generate a report for your own commits across all branches:
```bash
friday report --current-user
```

## Workflow

- [Release Workflow (EN)](./docs/release-workflow.en.md)
- [Release Workflow (RU)](./docs/release-workflow.ru.md)
