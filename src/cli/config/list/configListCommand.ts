import { Command } from 'commander';
import { configListAction } from '@/cli/config/list/configListAction.js';

export function configList(configCommand: Command) {
  configCommand
    .command('list')
    .description('List all configuration settings')
    .action(async () => {
      await configListAction();
    });
}
