import { AI_COMPLETION_MODEL } from '@/config.js';

import { Command } from 'commander';
import ora from 'ora';

import { generateReportUseCase, saveReportUseCase, gitService } from './dependencies.js';

export function setupCommands(program: Command): void {
  program
    .command('generate')
    .description('Generate a report from git commits')
    .option('-a, --authors <authors...>', 'Git authors')
    .option('-b, --branches <branches...>', 'Git branches')
    .action(async (options: {
      authors?: string[];
      branches?: string[]
    }) => {
      const spinner = ora();

      try {
        if (!options.authors || !options.branches || !AI_COMPLETION_MODEL) {
          spinner.fail('Please provide both authors and branches');

          return;
        }

        spinner.start('Searching for commits...');

        const gitLogOutput = await gitService.getCommitLog({
          authors: options.authors,
          branches: options.branches,
        });

        if (!gitLogOutput.trim()) {
          spinner.warn('No commits found for the specified criteria.');

          return;
        }

        spinner.succeed('Commits found');

        spinner.start('Generating report...');

        const generationResult = await generateReportUseCase.execute({
          gitLogOutput,
          gitCommandParams: {
            authors: options.authors,
            branches: options.branches,
            llmModelName: AI_COMPLETION_MODEL,
            llmProvider: 'openrouter',
          },
        });

        if (generationResult.isError()) {
          spinner.fail(`Failed to generate report: ${generationResult.error.message ?? 'Unknown error'}`);

          return;
        }

        const report = generationResult.value;

        if (report.status !== 'COMPLETED' || !report.body) {
          spinner.fail(`Failed to generate report: ${report.error ?? 'Unknown error'}`);

          return;
        }

        spinner.succeed('Report generated successfully\n');
        console.log(report.body);
        console.log('\nStatistics:');
        console.log(report.statistics);

        spinner.start('Saving report to database...');

        const saveResult = await saveReportUseCase.execute({ report });

        if (saveResult.isError()) {
          spinner.warn(`\nWarning: Failed to save the report. ${saveResult.error.message}`);
        } else {
          spinner.succeed('Report saved to database.');
        }
      } catch (error) {
        spinner.fail(`An unexpected error occurred: ${error instanceof Error
          ? error.message
          : String(error)}`);
      }
    });
}
