import { Command } from 'commander';
import { prAction } from '@/cli/commands/pr/pr.action.js';

import type { AppConfig } from '@/cli/commands/config/config.types.js';
import type { PrCommandOption } from '@/cli/commands/pr/pr.types.js';

export function pr(program: Command, appConfig: AppConfig) {
  program
    .command('pr')
    .description(
      'Generate a PR report based on commit history within pull requests',
    )
    .requiredOption(
      '-r, --range <range>',
      'Revision range for commits (e.g., main..dev, HEAD~5..HEAD)',
    )
    .action(
      async (options: PrCommandOption) => await prAction(options, appConfig),
    );
}
