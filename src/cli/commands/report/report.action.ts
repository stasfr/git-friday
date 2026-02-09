import ora from 'ora';

import { setupLocalization, $l } from '@/localization/localization.js';
import { GitService } from '@/services/git.service.js';
import { ReportLlmService } from '@/cli/commands/report/report.llm.js';

import type { AppConfig } from '@/cli/commands/config/config.types.js';
import type {
  CommandOption,
  IReport,
} from '@/cli/commands/report/report.types.js';

export async function reportAction(
  options: CommandOption,
  appConfig: AppConfig,
) {
  const spinner = ora();
  setupLocalization(appConfig.appLocalization);
  const gitService = new GitService();

  try {
    spinner.start($l('creatingGitLogCommand'));

    if (options.all === true) {
      gitService.forAllBranches();
    }

    if (options.branches && options.branches.length > 0) {
      gitService.forBranches(options.branches);
    }

    if (options.authors) {
      gitService.forAuthors(options.authors);
    } else if (options.currentUser) {
      await gitService.forCurrentUser();
    }

    if (options.since) {
      gitService.since(options.since);
    }

    if (options.until) {
      gitService.until(options.until);
    }

    if (options.today === true) {
      gitService.today();
    }

    gitService.pretty();
    spinner.succeed(`${$l('gitLogCommandCreated')}: ${gitService.command}`);

    spinner.start($l('searchingForCommits'));
    const sourceCommits = await gitService.getCommitLog();

    if (sourceCommits.length === 0) {
      throw new Error($l('noCommitsFound'));
    }

    spinner.succeed(`${$l('commitsFounded')}: ${sourceCommits.length}`);
    spinner.start($l('generatingReport'));

    const reportLlmService = new ReportLlmService(appConfig);

    const completionResult = await reportLlmService.getReportBody(
      sourceCommits.join('\n'),
    );

    if (!completionResult) {
      throw new Error($l('gotEmptyResponseFromLlm'));
    }

    const report = {
      body: completionResult.content,
      statistic: {
        promptTokens: completionResult.promptTokens,
        completionTokens: completionResult.completionTokens,
        totalTokens:
          completionResult.promptTokens + completionResult.completionTokens,
      },
    } satisfies IReport;

    spinner.succeed($l('reportGeneratedSuccessfully'));

    const statisticsData = {
      [$l('promptWord')]: { value: report.statistic.promptTokens },
      [$l('completionWord')]: {
        value: report.statistic.completionTokens,
      },
      [$l('totalWord')]: { value: report.statistic.totalTokens },
    };

    console.log();
    console.log($l('reportWord'));
    console.log(report.body.trim());

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
