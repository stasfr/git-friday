import { Command } from 'commander';
import { configInitAction } from '@/cli/commands/config/init/init.action.js';

export function configInit(configCommand: Command) {
  configCommand
    .command('init')
    .description('Initialize configuration settings for the application')
    .action(async () => {
      await configInitAction();
    });
}
