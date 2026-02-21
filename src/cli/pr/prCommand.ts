import { Command } from 'commander';
import { ConfigService } from '@/cli/config/configService.js';
import { prAction } from '@/cli/pr/prAction.js';

export function pr(program: Command) {
  program
    .command('pr')
    .description(
      'Generate a PR report based on commit history within pull requests',
    )
    .action(async () => {
      const configService = new ConfigService();
      const appConfig = await configService.getValidAppConfig();
      await prAction(appConfig);
    });
}
