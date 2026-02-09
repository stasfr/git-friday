import { Command } from 'commander';
import { ConfigService } from '@/cli/commands/config/config.service.js';
import { configExistCheckHook } from '@/cli/commands/config/hooks/configExistCheckHook.js';
import { prAction } from '@/cli/commands/pr/pr.action.js';

import type { PrCommandOption } from '@/cli/commands/pr/pr.types.js';

export function pr(program: Command) {
  program
    .command('pr')
    .description(
      'Generate a PR report based on commit history within pull requests',
    )
    .requiredOption(
      '-r, --range <range>',
      'Revision range for commits (e.g., main..dev, HEAD~5..HEAD)',
    )
    .hook('preAction', configExistCheckHook)
    .action(async (options: PrCommandOption) => {
      const configService = new ConfigService();
      const appConfig = await configService.getAppConfig();
      await prAction(options, appConfig);
    });
}
