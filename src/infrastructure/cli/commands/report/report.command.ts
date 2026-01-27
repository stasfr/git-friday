import ora from 'ora';
import { Command } from 'commander';
import { appConfig } from '@/infrastructure/config/config.js';

import { GitService } from '@/infrastructure/cli/services/git.service.js';
import { generateReport } from '@/infrastructure/cli/commands/report/generateReport.js';

export type CommandOption = {
  authors?: string[];
  branches?: string[];
  currentUser: boolean;
};

export function report(program: Command) {
  program
    .command('report')
    .description('Generate a report from git commits')
    .option('-a, --authors <authors...>', 'Git authors')
    .option('-b, --branches <branches...>', 'Git branches')
    .option('--current-user', 'Filter commits by your git user.email', false)
    .action(async (options: CommandOption) => {
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

        const report = await generateReport({
          sourceCommits,
          gitCommandParams: {
            authors: options.authors,
            branches: options.branches,
            llmModelName: appConfig.aiCompletionModel,
            llmProvider: 'openrouter',
          },
        });

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
      } catch (error) {
        spinner.fail(
          `An unexpected error occurred: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      }
    });
}
