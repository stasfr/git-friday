import ora from 'ora';

import { setupLocalization, $l } from '@/localization/localization.js';
import { GitService } from '@/services/git.service.js';
import { PrLlmService } from '@/cli/commands/pr/pr.llm.js';

import type { AppConfig } from '@/cli/commands/config/config.types.js';
import type {
  PrCommandOption,
  IPullRequestBody,
} from '@/cli/commands/pr/pr.types.js';

export async function prAction(options: PrCommandOption, appConfig: AppConfig) {
  const spinner = ora();
  setupLocalization(appConfig.appLocalization);
  const gitService = new GitService();

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

    const prLlmService = new PrLlmService(appConfig);

    const completionResult = await prLlmService.getPrTextBody(
      sourceCommits.join('\n'),
    );

    if (!completionResult) {
      throw new Error($l('gotEmptyResponseFromLlm'));
    }

    const prText = {
      body: completionResult.content,
      statistic: {
        promptTokens: completionResult.promptTokens,
        completionTokens: completionResult.completionTokens,
        totalTokens:
          completionResult.promptTokens + completionResult.completionTokens,
      },
    } satisfies IPullRequestBody;

    spinner.succeed($l('pullRequestTextGeneratedSuccess'));

    const statisticsData = {
      [$l('promptWord')]: { value: prText.statistic.promptTokens },
      [$l('completionWord')]: {
        value: prText.statistic.completionTokens,
      },
      [$l('totalWord')]: { value: prText.statistic.totalTokens },
    };

    console.log();
    console.log($l('pullRequestTextWord'));
    console.log(prText.body.trim());

    console.log();
    console.log($l('tokenUsageStatisticsTitle'));
    console.table(statisticsData);
  } catch (error: unknown) {
    spinner.fail(
      `${$l('errorOccured')}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}
