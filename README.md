# Git Digest

An intelligent CLI tool that uses AI to analyze git commits and generate a clear, human-readable report. It helps team leads and managers quickly understand the progress made by developers without digging through technical commit logs.

## Installation

You can install Git Digest globally using your preferred package manager:

### npm
```bash
npm install -g @stas_fr/git-digest
```

### pnpm
```bash
pnpm add -g @stas_fr/git-digest
```

### yarn
```bash
yarn global add @stas_fr/git-digest
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

The main command is `generate`. It accepts the following parameters:

*   `-a, --authors <authors...>`: (Required) A space-separated list of Git authors whose commits you want to analyze.
*   `-b, --branches <branches...>`: (Required) A space-separated list of branches to include in the analysis.

### Example

Here is an example of how to run the command:

```bash
gtc generate -a s.farkash stas_fr -b dev main
```

This command will search for all commits made today by the authors `s.farkash` and `stas_fr` within the `dev` and `main` branches, and then generate a consolidated report based on them.

## Workflow

- [Release Workflow (EN)](./docs/release-workflow.en.md)
- [Release Workflow (RU)](./docs/release-workflow.ru.md)
