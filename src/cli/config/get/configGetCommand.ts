import { Command } from 'commander';
import { configGetAction } from '@/cli/config/get/configGetAction.js';

import type { IFileBasedConfig } from '@/cli/config/configTypes.js';

export interface ConfigGetCommandOption {
  key: keyof IFileBasedConfig;
}

export function configGet(configCommand: Command) {
  configCommand
    .command('get')
    .description('Get config value by key')
    .argument('<key>', 'Configuration key to set')
    .action(async (key: keyof IFileBasedConfig) => {
      const options: ConfigGetCommandOption = { key };
      await configGetAction(options);
    });
}
