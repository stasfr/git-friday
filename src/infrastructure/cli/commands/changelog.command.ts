import { Command } from 'commander';

import type { DiContainer } from '@/infrastructure/di/container.js';

interface CommandOption { sinceTag: string; }

export function changelog(program: Command, diContainer: DiContainer): void {
  program
    .command('changelog')
    .description('Generate a changelog from git commits since a specific tag.')
    .option('--since-tag <tag>', 'The git tag to generate the changelog from.')
    .action(async (options: CommandOption) => {
      if (!options.sinceTag) {
        program.error('error: required option \'--since-tag <tag>\' not specified');
      }

      const { gitService, generateChangeLogUseCase, aiCompletionModel, spinner } = diContainer.cradle;

      try {
        spinner.start(`Searching for commits since tag ${options.sinceTag}...`);

        gitService
          .forBranches(null)
          .pretty()
          .sinceTag(options.sinceTag);

        const sourceCommits = await gitService.getCommitLog();

        if (sourceCommits.length === 0) {
          spinner.warn('No new commits found since the specified tag.');

          return;
        }

        spinner.succeed('Commits found');
        spinner.start('Generating changelog...');

        const generationResult = await generateChangeLogUseCase.execute({
          sourceCommits,
          gitCommandParams: {
            llmModelName: aiCompletionModel,
            llmProvider: 'openrouter',
          },
        });

        if (generationResult.isError()) {
          spinner.fail(`Failed to generate changelog: ${generationResult.error.message ?? 'Unknown error'}`);

          return;
        }

        const report = generationResult.value;

        if (!report.body) {
          spinner.fail(`Failed to generate changelog: ${report.error ?? 'Unknown error'}`);

          return;
        }

        spinner.succeed('Changelog generated successfully');

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
        console.log('Changelog:');
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
