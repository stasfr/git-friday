import ora from 'ora';

import { GitService } from '@/services/git.service.js';
import { ReportLlmService } from '@/cli/commands/report/report.llm.js';

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

  spinner.start('Searching for commits...');

  try {
    if (options.authors && options.currentUser) {
      throw new Error(
        "error: option '--authors <authors...>' cannot be used with option '--current-user'",
      );
    }

    gitService.forBranches(options.branches).today().pretty();

    if (options.authors) {
      gitService.forAuthors(options.authors);
    } else if (options.currentUser) {
      await gitService.forCurrentUser();
    }

    const sourceCommits = await gitService.getCommitLog();

    if (sourceCommits.length === 0) {
      throw new Error('No commits found for the specified criteria.');
    }

    spinner.succeed('Commits found');
    spinner.start('Generating report...');

    const reportLlmService = new ReportLlmService(appConfig);

    const completionResult = await reportLlmService.getReportBody(
      sourceCommits.join('\n'),
    );

    if (!completionResult) {
      throw new Error('Got empty response from Llm Provider');
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

    spinner.succeed('Report generated successfully');

    const statisticsData = {
      'Prompt Tokens': { value: report.statistic.promptTokens },
      'Completion Tokens': { value: report.statistic.completionTokens },
      'Total Tokens': { value: report.statistic.totalTokens },
    };

    console.log();
    console.log('Report:');
    console.log(report.body.trim());

    console.log();
    console.log('Statistics:');
    console.table(statisticsData);
  } catch (error: unknown) {
    spinner.fail(
      `An unexpected error occurred: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}
