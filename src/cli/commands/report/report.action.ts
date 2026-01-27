import ora from 'ora';

import { GitService } from '@/services/git.service.js';
import { ReportLlmService } from '@/cli/commands/report/report.llm.js';
import { ReportNotifications } from '@/cli/commands/report/report.notifications.js';

import type { AppConfig } from '@/config/config.types.js';
import type {
  CommandOption,
  IReport,
} from '@/cli/commands/report/report.types.js';

export async function reportAction(
  options: CommandOption,
  appConfig: AppConfig,
) {
  const spinner = ora();
  const gitService = new GitService();
  const notifications = new ReportNotifications(appConfig).getNotification();

  spinner.start(notifications.searchCommits);

  try {
    // TODO: Implement more validation logic to options
    // e.g. pnpm run dev report -a -b dev
    if (options.authors && options.currentUser) {
      throw new Error(notifications.optionsAuthorsCurrentUserError);
    }

    if (options.branches === null || options.branches === undefined) {
      gitService.forAllBranches();
    } else {
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

    if (!options.since && !options.until) {
      gitService.today();
    }

    gitService.pretty();
    const sourceCommits = await gitService.getCommitLog();

    if (sourceCommits.length === 0) {
      throw new Error(notifications.noCommitsFoundError);
    }

    spinner.succeed(`${notifications.commitsFound}: ${sourceCommits.length}`);
    spinner.start(notifications.generateReport);

    const reportLlmService = new ReportLlmService(appConfig);

    const completionResult = await reportLlmService.getReportBody(
      sourceCommits.join('\n'),
    );

    if (!completionResult) {
      throw new Error(notifications.llmEmptyResponse);
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

    spinner.succeed(notifications.reportGenerateSuccess);

    const statisticsData = {
      [notifications.promptTokens]: { value: report.statistic.promptTokens },
      [notifications.completionTokens]: {
        value: report.statistic.completionTokens,
      },
      [notifications.totalTokens]: { value: report.statistic.totalTokens },
    };

    console.log();
    console.log(notifications.report);
    console.log(report.body.trim());

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
