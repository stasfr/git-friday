import ora from 'ora';
import boxen from 'boxen';
import { input } from '@inquirer/prompts';

import { LlmService } from '@/services/llmService.js';
import { GitService } from '@/services/gitService.js';
import { reportPrompts } from '@/cli/report/reportPrompts.js';

import { generateUsageTables } from '@/helpers/generateUsageTables.js';

import type { AppConfig } from '@/cli/config/configTypes.js';

export async function reportAction(appConfig: AppConfig) {
  const spinner = ora();
  const gitService = new GitService();
  const llmService = new LlmService(appConfig);

  try {
    const customLog = await input({
      message: 'Enter your custom git log command: git log',
    });

    const sourceCommits = await gitService
      .customLog(customLog)
      .pretty()
      .getCommitLog();

    if (sourceCommits.length === 0) {
      throw new Error('No commits found for the specified criteria');
    }

    console.log(
      boxen(
        `Command: ${gitService.command}\nCommit Count: ${sourceCommits.length}`,
        {
          title: 'Git Log',
          padding: 0.75,
          margin: 0.75,
          borderColor: 'green',
          borderStyle: 'round',
        },
      ),
    );

    spinner.start('Generating report...');

    const systemPrompt = reportPrompts.getSystemPrompts(
      appConfig.llmPromptsLocalization,
    );
    const userPrompt = reportPrompts.getUserPrompt(
      sourceCommits.join('\n'),
      appConfig.llmPromptsLocalization,
    );

    const llmResponse = await llmService.getCompletion({
      systemPrompt,
      userPrompt,
    });

    if (!llmResponse) {
      throw new Error('Got empty response from Llm Provider');
    }

    spinner.succeed('Report generated successfully');

    console.log();
    console.log('Report:');
    console.log(llmResponse.content.trim());

    if (llmResponse.usage) {
      const usageTables = generateUsageTables(llmResponse.usage);

      if (usageTables.tokens) {
        console.log();
        console.log('Tokens Usage Statistics:');
        console.table(usageTables.tokens);
      }

      if (usageTables.cost) {
        console.log();
        console.log('Cost Statistics in $');
        console.table(usageTables.cost);
      }
    }
  } catch (error: unknown) {
    spinner.fail(
      `Error occurred: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}
