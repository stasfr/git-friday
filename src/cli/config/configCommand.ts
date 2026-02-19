import { Command } from 'commander';

import { configInit } from '@/cli/config/init/configInitCommand.js';
import { configSet } from '@/cli/config/set/configSetCommand.js';
import { configSetup } from '@/cli/config/setup/configSetupCommand.js';

export function config(program: Command) {
  const configCommand = program
    .command('config')
    .description('Manage application configuration settings');

  configInit(configCommand);
  configSet(configCommand);
  configSetup(configCommand);
}
