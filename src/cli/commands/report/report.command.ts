import { Command, Option } from 'commander';
import { reportAction } from '@/cli/commands/report/report.action.js';

import type { AppConfig } from '@/config/config.types.js';
import type { CommandOption } from '@/cli/commands/report/report.types.js';

export function report(program: Command, appConfig: AppConfig) {
  program
    .command('report')
    .description('Generate a report from git commits')
    .addOption(
      new Option('-a, --authors <authors...>', 'Git authors').conflicts(
        'current-user',
      ),
    )
    .option('-b, --branches <branches...>', 'Git branches')
    .option('--all', 'Include all branches', false)
    .option('--since <date>', 'Filter commits since a specific date')
    .option('--until <date>', 'Filter commits until a specific date')
    .addOption(
      new Option('--current-user', 'Filter commits by your git user.email')
        .conflicts('authors')
        .default(false),
    )
    .option(
      '-r, --range <range>',
      'Revision range for commits (e.g., main..dev, HEAD~5..HEAD)',
    )
    .option(
      '--since-ref <ref>',
      'Get commits after a specific tag or ref (e.g., v0.13.0)',
    )
    .action(
      async (options: CommandOption) => await reportAction(options, appConfig),
    );
}
