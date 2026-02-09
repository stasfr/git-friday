import { Command } from 'commander';
import { configSetAction } from '@/cli/commands/config/set/set.action.js';

import type { ConfigSetCommandOption } from '@/cli/commands/config/set/set.types.js';

export function configSet(configCommand: Command) {
  configCommand
    .command('set')
    .description('Set configuration settings for the application')
    .argument('<key>', 'Configuration key to set')
    .argument('<value>', 'Value to set for the key')
    .action(async (key: string, value: string) => {
      const options: ConfigSetCommandOption = { key, value };
      await configSetAction(options);
    });
}
