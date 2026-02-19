import { Command } from 'commander';
import { configSetupAction } from '@/cli/config/setup/configSetupAction.js';

export function configSetup(configCommand: Command) {
  configCommand
    .command('setup')
    .description('Step-by-step configuration setup')
    .action(async () => {
      await configSetupAction();
    });
}
