import { Command } from 'commander';
import { configInitAction } from '@/cli/config/init/configInitAction.js';

export function configInit(configCommand: Command) {
  configCommand
    .command('init')
    .description('Initialize configuration settings for the application')
    .action(async () => {
      await configInitAction();
    });
}
