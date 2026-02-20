import ora from 'ora';
import { input } from '@inquirer/prompts';

import { ExtendedError } from '@/errors/ExtendedError.js';
import { LlmService } from '@/services/llmService.js';
import { GitService } from '@/services/gitService.js';
import { prPrompts } from '@/cli/pr/prPrompts.js';

import { generateUsageTables } from '@/helpers/generateUsageTables.js';

import type { AppConfig } from '@/cli/config/configTypes.js';

export async function prAction(appConfig: AppConfig) {
  const spinner = ora({ color: 'green' });
  const gitService = new GitService();
  const llmService = new LlmService(appConfig);

  console.log('Enter your custom git log command:');
  const customLog = await input({
    message: 'git log',
  });

  const sourceCommits = await gitService
    .customLog(customLog)
    .pretty()
    .getCommitLog();

  if (sourceCommits.length === 0) {
    throw new ExtendedError({
      layer: 'CommandExecutionError',
      message: 'No commits found for the specified criteria',
      command: 'pr',
      service: null,
      hint: 'Check your git log command and try again',
    });
  }
  console.log(`\nCommits count: ${sourceCommits.length}\n`);

  const systemPrompt = prPrompts.getSystemPrompts(
    appConfig.llmPromptsLocalization,
  );
  const userPrompt = prPrompts.getUserPrompt(
    sourceCommits.join('\n'),
    appConfig.llmPromptsLocalization,
  );

  spinner.start('Generating pull request text...');

  const llmResponse = await llmService.getCompletion({
    systemPrompt,
    userPrompt,
  });

  if (!llmResponse) {
    throw new ExtendedError({
      layer: 'CommandExecutionError',
      message: 'Got empty response from Llm Provider',
      command: 'pr',
      service: null,
      hint: 'Check LLM provider key and url and try again',
    });
  }

  spinner.succeed('Pull Request text generated successfully');

  console.log('\nPull Request text:');
  console.log(llmResponse.content.trim());

  if (llmResponse.usage) {
    const usageTables = generateUsageTables(llmResponse.usage);

    if (usageTables.tokens) {
      console.log('\nTokens Usage Statistics:');
      console.table(usageTables.tokens);
    }

    if (usageTables.cost) {
      console.log('\nCost Statistics in $');
      console.table(usageTables.cost);
    }
  }
}
