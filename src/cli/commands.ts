import { AI_COMPLETION_MODEL } from '@/config.js';

import { Command } from 'commander';

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
      try {
        if (!options.authors || !options.branches || !AI_COMPLETION_MODEL) {
          throw new Error('Please provide both authors and branches');
        }

        const authorArgs = options.authors.map((author) => `--author="${author}"`)
          .join(' ');
        const branchArgs = options.branches.join(' ');

        const command = `git log ${branchArgs} ${authorArgs} --since="00:00:00" --pretty=format:"- %s%n%b"`;

        const execAsync = promisify(exec);

        const cwd = process.cwd();

        const { stdout: gitLogOutput } = await execAsync(command, { cwd });

        const report = await generateReportUseCase.execute({
          gitLogOutput,
          modelName: AI_COMPLETION_MODEL,
          gitCommandParams: {
            authors: options.authors,
            branches: options.branches,
          },
        });

        if (!report) {
          throw new Error('Failed to generate report');
        }

        if (report.status === 'COMPLETED') {
          console.log('Report generated successfully:');
          console.log(report.body);
          // Здесь можно вывести статистику
        } else {
          console.error('Failed to generate report:', report.error);
        }
      } catch (error) {
        console.error('An unexpected error occurred:', error);
      }
    });
}
