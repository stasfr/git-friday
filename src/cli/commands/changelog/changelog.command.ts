import { Command } from 'commander';
import { changelogAction } from '@/cli/commands/changelog/changelog.action.js';

import type { AppConfig } from '@/cli/commands/config/config.types.js';
import type { ChangelogCommandOption } from '@/cli/commands/changelog/changelog.types.js';

export function changelog(program: Command, appConfig: AppConfig) {
  program
    .command('changelog')
    .description('Generate a changelog from git commits since a specific tag')
    .requiredOption(
      '--since-ref <ref>',
      'Get commits after a specific tag or ref (e.g., v0.13.0)',
    )
    .action(
      async (options: ChangelogCommandOption) =>
        await changelogAction(options, appConfig),
    );
}
