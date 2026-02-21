import { Command, Argument } from 'commander';
import { configSetAction } from '@/cli/config/set/configSetAction.js';

export interface ConfigSetCommandOption {
  key: string;
  value: string;
}

export function configSet(configCommand: Command) {
  configCommand
    .command('set')
    .description('Set configuration settings for the application')
    .addArgument(
      new Argument('<key>', 'Configuration key to set').choices([
        'aiCompletionModel',
        'llmPromptsLocalization',
      ]),
    )
    .argument('<value>', 'Value to set for the key')
    .action(async (key: string, value: string) => {
      const options: ConfigSetCommandOption = { key, value };
      await configSetAction(options);
    });
}
