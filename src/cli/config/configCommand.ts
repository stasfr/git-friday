import { Command } from 'commander';

import { configSetup } from '@/cli/config/setup/configSetupCommand.js';
import { configSet } from '@/cli/config/set/configSetCommand.js';
import { configGet } from '@/cli/config/get/configGetCommand.js';

export function config(program: Command) {
  const configCommand = program
    .command('config')
    .description('Manage application configuration settings');

  configSetup(configCommand);
  configSet(configCommand);
  configGet(configCommand);
}
