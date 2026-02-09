import ora from 'ora';

import { GitService } from '@/services/git.service.js';
import { ChangelogLlmService } from '@/cli/commands/changelog/changelog.llm.js';
import { ChangelogNotifications } from '@/cli/commands/changelog/changelog.notifications.js';

import type { AppConfig } from '@/cli/commands/config/config.types.js';
import type {
  ChangelogCommandOption,
  IChangelog,
} from '@/cli/commands/changelog/changelog.types.js';

export async function changelogAction(
  options: ChangelogCommandOption,
  appConfig: AppConfig,
) {
  const spinner = ora();
  const gitService = new GitService();
  const notifications = new ChangelogNotifications(appConfig).getNotification();

  try {
    spinner.start(notifications.gitLogCommandCreation);

    gitService.sinceTag(options.sinceRef);

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
    spinner.start(notifications.generateChangelog);

    const changelogLlmService = new ChangelogLlmService(appConfig);

    const completionResult = await changelogLlmService.getChangelogBody(
      sourceCommits.join('\n'),
    );

    if (!completionResult) {
      throw new Error(notifications.llmEmptyResponse);
    }

    const changelog = {
      body: completionResult.content,
      statistic: {
        promptTokens: completionResult.promptTokens,
        completionTokens: completionResult.completionTokens,
        totalTokens:
          completionResult.promptTokens + completionResult.completionTokens,
      },
    } satisfies IChangelog;

    spinner.succeed(notifications.changelogGenerateSuccess);

    const statisticsData = {
      [notifications.promptTokens]: { value: changelog.statistic.promptTokens },
      [notifications.completionTokens]: {
        value: changelog.statistic.completionTokens,
      },
      [notifications.totalTokens]: { value: changelog.statistic.totalTokens },
    };

    console.log();
    console.log(notifications.changelog);
    console.log(changelog.body.trim());

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
