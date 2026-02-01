import ora from 'ora';

import { GitService } from '@/services/git.service.js';
import { PrLlmService } from '@/cli/commands/pr/pr.llm.js';
import { PrNotifications } from '@/cli/commands/pr/pr.notifications.js';

import type { AppConfig } from '@/services/config/config.types.js';
import type {
  PrCommandOption,
  IPullRequestBody,
} from '@/cli/commands/pr/pr.types.js';

export async function prAction(options: PrCommandOption, appConfig: AppConfig) {
  const spinner = ora();
  const gitService = new GitService();
  const notifications = new PrNotifications(appConfig).getNotification();

  try {
    spinner.start(notifications.gitLogCommandCreation);

    gitService.forRange(options.range);

    gitService.pretty();
    spinner.succeed(
      `${notifications.gitLogCommandCreated}: ${gitService.command}`,
    );

    spinner.start(notifications.searchCommits);
    const sourceCommits = await gitService.getCommitLog();

    if (sourceCommits.length === 0) {
      throw new Error(notifications.noCommitsFoundError);
    }

    spinner.succeed(`${notifications.commitsFound}: ${sourceCommits.length}`);
    spinner.start(notifications.generatePrText);

    const prLlmService = new PrLlmService(appConfig);

    const completionResult = await prLlmService.getPrTextBody(
      sourceCommits.join('\n'),
    );

    if (!completionResult) {
      throw new Error(notifications.llmEmptyResponse);
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

    spinner.succeed(notifications.prTextGenerateSuccess);

    const statisticsData = {
      [notifications.promptTokens]: { value: prText.statistic.promptTokens },
      [notifications.completionTokens]: {
        value: prText.statistic.completionTokens,
      },
      [notifications.totalTokens]: { value: prText.statistic.totalTokens },
    };

    console.log();
    console.log(notifications.prText);
    console.log(prText.body.trim());

    console.log();
    console.log(notifications.statistics);
    console.table(statisticsData);
  } catch (error: unknown) {
    spinner.fail(
      `${notifications.errorOccured}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}
