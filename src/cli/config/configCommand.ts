import { Command } from 'commander';

import { configInit } from '@/cli/config/init/configInitCommand.js';
import { configSet } from '@/cli/config/set/configSetCommand.js';

export function config(program: Command) {
  const configCommand = program
    .command('config')
    .description('Manage application configuration settings');

  configInit(configCommand);
  configSet(configCommand);
}
