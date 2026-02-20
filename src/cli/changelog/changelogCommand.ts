import { Command } from 'commander';
import { ConfigService } from '@/cli/config/configService.js';
import { changelogAction } from '@/cli/changelog/changelogAction.js';

export function changelog(program: Command) {
  program
    .command('changelog')
    .description('Generate a changelog from git commits since a specific tag')
    .action(async () => {
      const configService = new ConfigService();
      const appConfig = await configService.getAppConfig();
      await changelogAction(appConfig);
    });
}
