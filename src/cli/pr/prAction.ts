import ora from 'ora';
import boxen from 'boxen';
import { input } from '@inquirer/prompts';

import { $l } from '@/localization/localization.js';
import { LlmService } from '@/services/llmService.js';
import { GitService } from '@/services/gitService.js';
import { prPrompts } from '@/cli/pr/prPrompts.js';

import { generateUsageTables } from '@/helpers/generateUsageTables.js';

import type { AppConfig } from '@/cli/config/configTypes.js';

export async function prAction(appConfig: AppConfig) {
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
      throw new Error($l('noCommitsFound'));
    }

    console.log(
      boxen(
        `${$l('commandWord')}: ${gitService.command}\n${$l('commitCount')}: ${sourceCommits.length}`,
        {
          title: 'Git Log',
          padding: 0.75,
          margin: 0.75,
          borderColor: 'green',
          borderStyle: 'round',
        },
      ),
    );

    spinner.start($l('generatingPullRequestText'));

    const systemPrompt = prPrompts.getSystemPrompts(appConfig.appLocalization);
    const userPrompt = prPrompts.getUserPrompt(
      sourceCommits.join('\n'),
      appConfig.appLocalization,
    );

    const llmResponse = await llmService.getCompletion({
      systemPrompt,
      userPrompt,
    });

    if (!llmResponse) {
      throw new Error($l('gotEmptyResponseFromLlm'));
    }

    spinner.succeed($l('pullRequestTextGeneratedSuccess'));

    console.log();
    console.log($l('pullRequestTextWord'));
    console.log(llmResponse.content.trim());

    if (llmResponse.usage) {
      const usageTables = generateUsageTables(llmResponse.usage);

      if (usageTables.tokens) {
        console.log();
        console.log($l('tokenUsageStatisticsTitle'));
        console.table(usageTables.tokens);
      }

      if (usageTables.cost) {
        console.log();
        console.log($l('costStatistics'));
        console.table(usageTables.cost);
      }
    }
  } catch (error: unknown) {
    spinner.fail(
      `${$l('errorOccured')}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}
