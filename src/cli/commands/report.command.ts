import { AI_COMPLETION_MODEL } from '@/config.js';

import { Command } from 'commander';

import { generateReportUseCase, gitService } from '@/cli/dependencies.js';
import ora from 'ora';

interface CommandOption {
  authors?: string[];
  branches?: string[]
}

async function command(options: CommandOption): Promise<void> {
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
}

export function report(program: Command): void {
  program
    .command('generate')
    .description('Generate a report from git commits')
    .option('-a, --authors <authors...>', 'Git authors')
    .option('-b, --branches <branches...>', 'Git branches')
    .action(command);
}
