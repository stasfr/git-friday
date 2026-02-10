import { Command } from 'commander';
import { ConfigService } from '@/cli/commands/config/config.service.js';
import { configExistCheckHook } from '@/cli/commands/config/hooks/configExistCheckHook.js';
import { changelogAction } from '@/cli/commands/changelog/changelog.action.js';

export type ChangelogCommandOption = {
  sinceRef: string;
};

export function changelog(program: Command) {
  program
    .command('changelog')
    .description('Generate a changelog from git commits since a specific tag')
    .requiredOption(
      '--since-ref <ref>',
      'Get commits after a specific tag or ref (e.g., v0.13.0)',
    )
    .hook('preAction', configExistCheckHook)
    .action(async (options: ChangelogCommandOption) => {
      const configService = new ConfigService();
      const appConfig = await configService.getAppConfig();
      await changelogAction(options, appConfig);
    });
}
