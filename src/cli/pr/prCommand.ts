import { Command } from 'commander';
import { ConfigService } from '@/cli/config/configService.js';
import { configExistCheckHook } from '@/cli/config/hooks/configExistCheckHook.js';
import { prAction } from '@/cli/pr/prAction.js';

export function pr(program: Command) {
  program
    .command('pr')
    .description(
      'Generate a PR report based on commit history within pull requests',
    )
    .hook('preAction', configExistCheckHook)
    .action(async () => {
      const configService = new ConfigService();
      const appConfig = await configService.getAppConfig();
      await prAction(appConfig);
    });
}
