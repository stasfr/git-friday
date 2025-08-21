import { Command } from 'commander';

import type { DiContainer } from '@/infrastructure/di/container.js';

interface CommandOption {
  authors?: string[];
  branches?: string[];
  currentUser: boolean;
}

export function report(program: Command, diContainer: DiContainer): void {
  program
    .command('report')
    .description('Generate a report from git commits')
    .option('-a, --authors <authors...>', 'Git authors')
    .option('-b, --branches <branches...>', 'Git branches')
    .option('--current-user', 'Filter commits by your git user.email', false)
    .action(async (options: CommandOption) => {
      if (options.authors && options.currentUser) {
        program.error('error: option \'--authors <authors...>\' cannot be used with option \'--current-user\'');
      }

      const { gitService, generateReportUseCase, aiCompletionModel, spinner } = diContainer.cradle;

      try {
        spinner.start('Searching for commits...');

        gitService.forBranches(options.branches)
          .today()
          .pretty();

        if (options.authors) {
          gitService.forAuthors(options.authors);
        } else if (options.currentUser) {
          await gitService.forCurrentUser();
        }

        const sourceCommits = await gitService.getCommitLog();

        if (sourceCommits.length === 0) {
          spinner.warn('No commits found for the specified criteria.');

          return;
        }

        spinner.succeed('Commits found');
        spinner.start('Generating report...');

        const generationResult = await generateReportUseCase.execute({
          sourceCommits,
          gitCommandParams: {
            authors: options.authors,
            branches: options.branches,
            llmModelName: aiCompletionModel,
            llmProvider: 'openrouter',
          },
        });

        if (generationResult.isError()) {
          spinner.fail(`Failed to generate report: ${generationResult.error.message ?? 'Unknown error'}`);

          return;
        }

        const report = generationResult.value;

        if (!report.body) {
          spinner.fail(`Failed to generate report: ${report.error ?? 'Unknown error'}`);

          return;
        }

        spinner.succeed('Report generated successfully');

        if (report.saved) {
          spinner.succeed('Report saved to database.');
        } else {
          spinner.warn(`Warning: Report was generated, but failed to save: ${report.error ?? 'Unknown error'}`);
        }

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
        spinner.fail(`An unexpected error occurred: ${error instanceof Error
          ? error.message
          : String(error)}`);
      }
    });
}
