import ora from 'ora';

import { setupLocalization, $l } from '@/localization/localization.js';
import { LlmService } from '@/services/llmService.js';
import { GitService } from '@/services/gitService.js';
import { prPrompts } from '@/cli/pr/prPrompts.js';

import { generateUsageTables } from '@/helpers/generateUsageTables.js';

import type { AppConfig } from '@/cli/config/configTypes.js';
import type { PrCommandOption } from '@/cli/pr/prCommand.js';

export async function prAction(options: PrCommandOption, appConfig: AppConfig) {
  const spinner = ora();
  setupLocalization(appConfig.appLocalization);
  const gitService = new GitService();
  const llmService = new LlmService(appConfig);

  try {
    spinner.start($l('creatingGitLogCommand'));

    gitService.forRange(options.range);

    gitService.pretty();
    spinner.succeed(`${$l('gitLogCommandCreated')}: ${gitService.command}`);

    spinner.start($l('searchingForCommits'));
    const sourceCommits = await gitService.getCommitLog();

    if (sourceCommits.length === 0) {
      throw new Error($l('noCommitsFound'));
    }

    spinner.succeed(`${$l('commitsFounded')}: ${sourceCommits.length}`);
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
        console.log('Cost Statistics in $:');
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
