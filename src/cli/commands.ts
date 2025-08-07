import { AI_COMPLETION_MODEL } from '@/config.js';

import { Command } from 'commander';
import ora from 'ora';

import { exec } from 'child_process';
import { promisify } from 'util';

import { generateReportUseCase } from './dependencies.js';

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

        const authorArgs = options.authors.map((author) => `--author="${author}"`)
          .join(' ');
        const branchArgs = options.branches.join(' ');

        const command = `git log ${branchArgs} ${authorArgs} --since="00:00:00" --pretty=format:"- %s%n%b"`;

        const execAsync = promisify(exec);

        const cwd = process.cwd();

        const { stdout: gitLogOutput } = await execAsync(command, { cwd });

        if (!gitLogOutput.trim()) {
          spinner.warn('No commits found for the specified criteria.');

          return;
        }

        spinner.succeed('Commits found');

        spinner.start('Generating report...');

        const report = await generateReportUseCase.execute({
          gitLogOutput,
          modelName: AI_COMPLETION_MODEL,
          gitCommandParams: {
            authors: options.authors,
            branches: options.branches,
          },
        });

        if (report.isError()) {
          spinner.fail('Failed to generate report');

          return;
        }

        if (report.value.status === 'COMPLETED') {
          spinner.succeed('Report generated successfully\n');
          console.log(report.value.body);
        } else {
          spinner.fail(`Failed to generate report: ${report.value.error ?? 'Unknown error'}`);
        }
      } catch (error) {
        spinner.fail(`An unexpected error occurred: ${error instanceof Error
          ? error.message
          : String(error)}`);
      }
    });
}
