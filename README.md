# Git Friday

An intelligent CLI tool that uses AI to analyze git commits and generate a clear, human-readable report. It helps team leads and managers quickly understand the progress made by developers without digging through technical commit logs.

## Docs links

- [Release Workflow](./docs/release-workflow.en.md) - how do I release a new version of the project?

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

Git Friday uses a file-based configuration system. Before using the tool, run the interactive setup command:

```bash
friday config setup
```

This will guide you through the configuration interactively, prompting you to enter the required values step by step.

Alternatively, you can set individual configuration values manually at any time:

```bash
friday config set aiCompletionModel "openai/gpt-4o"
friday config set appLocalization "en"
```

The available configuration keys are:

- `aiCompletionModel`: The identifier of the AI model you want to use (e.g., `mistralai/mistral-7b-instruct`, `openai/gpt-4o`).
- `appLocalization`: (Optional) The language for the application interface. Supported values are `en` (English) and `ru` (Russian). Defaults to `ru` if not specified.

The tool will not work without the required environment variables and configuration values defined.

### Available Commands

Git Friday provides several commands to generate different types of content based on your git history.

---

#### `config`

Manage application configuration settings.

##### `config setup`

Interactively configure the application settings. This command walks you through all available options step by step, creating or updating the configuration file.

```bash
friday config setup
```

##### `config set`

Set a specific configuration value.

**Arguments:**

- `<key>`: Configuration key to set (e.g., `aiCompletionModel`, `appLocalization`).
- `<value>`: Value to set for the key.

**Examples:**

```bash
friday config set aiCompletionModel "google/gemini-3-flash-preview"
friday config set appLocalization "ru"
```

---

#### `report`

Generates a daily activity report based on git commits.

Run the command without any arguments — it will interactively prompt you to enter a full `git log` command:

```bash
friday report
```

```
? Enter your custom git log command: git log
```

You can type any valid `git log` command, for example:

```
? Enter your custom git log command: git log --author="s.farkash" --since="yesterday"
? Enter your custom git log command: git log main..dev
? Enter your custom git log command: git log HEAD~5..HEAD
```

---

#### `pr`

Generates a PR (Pull Request) description based on commit history.

Run the command without any arguments — it will interactively prompt you to enter a full `git log` command:

```bash
friday pr
```

```
? Enter your custom git log command: git log
```

You can type any valid `git log` command, for example:

```
? Enter your custom git log command: git log main..dev
? Enter your custom git log command: git log HEAD~10..HEAD
? Enter your custom git log command: git log origin/main..feature/new-feature
```

---

#### `changelog`

Generates a changelog from git commits.

Run the command without any arguments — it will interactively prompt you to enter a full `git log` command:

```bash
friday changelog
```

```
? Enter your custom git log command: git log
```

You can type any valid `git log` command, for example:

```
? Enter your custom git log command: git log v0.13.0..HEAD
? Enter your custom git log command: git log abc1234..HEAD
? Enter your custom git log command: git log main..release/1.0
```

---

### Output Statistics

After generating any report, Git Friday displays usage statistics:

- **Token Usage**: Shows the number of tokens used for the prompt, completion, and the total tokens consumed during AI processing.
- **Cost Summary**: If you're using OpenRouter or another provider that supports cost reporting, a cost summary will be displayed showing the total cost of the API request in USD.
