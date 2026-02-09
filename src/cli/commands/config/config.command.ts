import { Command } from 'commander';

import { configInit } from '@/cli/commands/config/init/init.command.js';
import { configSet } from '@/cli/commands/config/set/set.command.js';

export function config(program: Command) {
  const configCommand = program
    .command('config')
    .description('Manage application configuration settings');

  configInit(configCommand);
  configSet(configCommand);
}
