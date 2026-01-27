import { Command } from 'commander';
import { reportAction } from '@/cli/commands/report/report.action.js';

import type { AppConfig } from '@/config/config.types.js';
import type { CommandOption } from '@/cli/commands/report/report.types.js';

export function report(program: Command, appConfig: AppConfig) {
  program
    .command('report')
    .description('Generate a report from git commits')
    .option('-a, --authors <authors...>', 'Git authors')
    .option('-b, --branches <branches...>', 'Git branches')
    .option('--since <date>', 'Filter commits since a specific date')
    .option('--until <date>', 'Filter commits until a specific date')
    .option('--current-user', 'Filter commits by your git user.email', false)
    .action(
      async (options: CommandOption) => await reportAction(options, appConfig),
    );
}
