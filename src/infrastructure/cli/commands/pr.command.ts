import { Command } from 'commander';

import type { DiContainer } from '@/infrastructure/di/container.js';

interface CommandOption { branches: string; }

export function pr(program: Command, diContainer: DiContainer): void {
  program
    .command('pr')
    .description('Generate a pull request description from git commits')
    .option('-b, --branches <branches>', 'Git branches to compare in target..source syntax (e.g., main..develop)')
    .action(async (options: CommandOption) => {
      if (!options.branches) {
        program.error('error: required option \'-b, --branches <branches>\' not specified');
      }

      const branchesPattern = /^[^.\s]+\.\.[^.\s]+$/;

      if (!branchesPattern.test(options.branches)) {
        program.error('error: invalid format for --branches option. Expected format: "target..source"');
      }

      const { gitService, generatePullRequestUseCase, aiCompletionModel, spinner } = diContainer.cradle;

      try {
        spinner.start('Searching for commits...');

        gitService.forRange(options.branches)
          .pretty();

        const gitLogOutput = await gitService.getCommitLog();

        if (!gitLogOutput.trim()) {
          spinner.warn('No commits found for the specified criteria.');

          return;
        }

        spinner.succeed('Commits found');
        spinner.start('Generating pull request description...');

        const generationResult = await generatePullRequestUseCase.execute({
          gitLogOutput,
          gitCommandParams: {
            llmModelName: aiCompletionModel,
            llmProvider: 'openrouter',
          },
        });

        if (generationResult.isError()) {
          spinner.fail(`Failed to generate pull request description: ${generationResult.error.message ?? 'Unknown error'}`);

          return;
        }

        const report = generationResult.value;

        if (!report.body) {
          spinner.fail(`Failed to generate pull request description: ${report.error ?? 'Unknown error'}`);

          return;
        }

        spinner.succeed('Pull request description generated successfully');

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
        console.log('Pull Request Description:');
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
