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

## Quick Start

To use the utility, you must be inside a Git repository.

Before running, you need to set up a `.env` file in the root of your repository with the following variables:

- `OPENAI_BASE_URL`: The base URL for the OpenAI-compatible API endpoint (e.g., `https://openrouter.ai/api/v1` for OpenRouter).
- `OPENAI_API_KEY`: Your API key for the AI service.

Git Friday uses a profile-based system to manage different configurations for various use cases. Here's how to get started:

### 1. Create a Profile

Create a new profile using the interactive command:

```bash
friday profile create
```

### 2. Set Up Your Profile

Run the interactive setup to configure your profile step by step:

```bash
friday profile setup
```

This will guide you through configuring the essential settings like the AI model and git log command.

### 3. Fine-tune Configuration (Optional)

You can also set individual configuration values directly:

```bash
friday profile config set
```

Available configuration keys include:

- `gitLogCommand`: The git log command to use for fetching commits.
- `aiCompletionModel`: The AI model identifier for processing.

### 4. Add Prompts

Prompts define how the AI processes your git history. First, navigate to the directory containing your prompt file, then add it to your profile:

```bash
cd /path/to/prompts
friday profile prompt add -f my-prompt.md
```

You can add both system and user prompts to customize the AI's behavior.

Note that CLI save your prompts only in `.md` format.

### 5. Run Your Profile

Once configured, run your profile to generate the output:

```bash
friday run
# or directly by profile name
friday run -p my-profile
```

The result can be output either to the console or saved to a file, depending on your preference.
