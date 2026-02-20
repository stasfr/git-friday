import ora from 'ora';
import { input } from '@inquirer/prompts';

import { ExtendedError } from '@/errors/ExtendedError.js';
import { LlmService } from '@/services/llmService.js';
import { GitService } from '@/services/gitService.js';
import { reportPrompts } from '@/cli/report/reportPrompts.js';

import { generateUsageTables } from '@/helpers/generateUsageTables.js';

import type { AppConfig } from '@/cli/config/configTypes.js';

export async function reportAction(appConfig: AppConfig) {
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
      command: 'report',
      service: null,
      hint: 'Check your git log command and try again',
    });
  }
  console.log(`\nCommits count: ${sourceCommits.length}\n`);

  const systemPrompt = reportPrompts.getSystemPrompts(
    appConfig.llmPromptsLocalization,
  );
  const userPrompt = reportPrompts.getUserPrompt(
    sourceCommits.join('\n'),
    appConfig.llmPromptsLocalization,
  );

  spinner.start('Generating report...');

  const llmResponse = await llmService.getCompletion({
    systemPrompt,
    userPrompt,
  });

  if (!llmResponse) {
    throw new ExtendedError({
      layer: 'CommandExecutionError',
      message: 'Got empty response from Llm Provider',
      command: 'report',
      service: null,
      hint: 'Check LLM provider key and url and try again',
    });
  }

  spinner.succeed('Report generated successfully');

  console.log('\nReport:');
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
