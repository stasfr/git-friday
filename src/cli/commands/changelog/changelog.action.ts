import ora from 'ora';

import { setupLocalization, $l } from '@/localization/localization.js';
import { GitService } from '@/services/git.service.js';
import { ChangelogLlmService } from '@/cli/commands/changelog/changelog.llm.js';

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
  setupLocalization(appConfig.appLocalization);
  const gitService = new GitService();

  try {
    spinner.start($l('creatingGitLogCommand'));

    gitService.sinceTag(options.sinceRef);

    gitService.pretty();
    spinner.succeed(`${$l('gitLogCommandCreated')}: ${gitService.command}`);

    spinner.start($l('searchingForCommits'));
    const sourceCommits = await gitService.getCommitLog();

    if (sourceCommits.length === 0) {
      throw new Error($l('noCommitsFound'));
    }

    spinner.succeed(`${$l('commitsFounded')}: ${sourceCommits.length}`);
    spinner.start($l('generatingChangelog'));

    const changelogLlmService = new ChangelogLlmService(appConfig);

    const completionResult = await changelogLlmService.getChangelogBody(
      sourceCommits.join('\n'),
    );

    if (!completionResult) {
      throw new Error($l('gotEmptyResponseFromLlm'));
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

    spinner.succeed($l('changelogGeneratedSuccessfully'));

    const statisticsData = {
      [$l('promptWord')]: { value: changelog.statistic.promptTokens },
      [$l('completionWord')]: {
        value: changelog.statistic.completionTokens,
      },
      [$l('totalWord')]: { value: changelog.statistic.totalTokens },
    };

    console.log();
    console.log($l('changelogWord'));
    console.log(changelog.body.trim());

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
