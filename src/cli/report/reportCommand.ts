import { Command, Option } from 'commander';
import { ConfigService } from '@/cli/config/configService.js';
import { configExistCheckHook } from '@/cli/config/hooks/configExistCheckHook.js';
import { reportAction } from '@/cli/report/reportAction.js';

export type ReportCommandOption = {
  authors?: string[];
  branches?: string[];
  all: boolean;
  since?: string;
  until?: string;
  currentUser: boolean;
  range?: string;
  sinceRef?: string;
  today?: boolean;
  customLog: boolean;
};

export function report(program: Command) {
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
    .addOption(
      new Option('--today', 'Filter commits by today')
        .conflicts('since')
        .conflicts('until'),
    )
    .addOption(
      new Option(
        '--since <date>',
        'Filter commits since a specific date',
      ).conflicts('today'),
    )
    .addOption(
      new Option(
        '--until <date>',
        'Filter commits until a specific date',
      ).conflicts('today'),
    )
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
    .addOption(
      new Option(
        '--custom-log',
        'Get commits using a custom git log command. All other options will be ignored',
      ).default(false),
    )
    .hook('preAction', configExistCheckHook)
    .action(async (options: ReportCommandOption) => {
      const configService = new ConfigService();
      const appConfig = await configService.getAppConfig();
      await reportAction(options, appConfig);
    });
}
