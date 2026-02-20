import { select, input, confirm } from '@inquirer/prompts';

import { ExtendedError } from '@/errors/ExtendedError.js';
import { ConfigService } from '@/cli/config/configService.js';

export async function configSetupAction() {
  const configService = new ConfigService();

  const configExists = await configService.checkIfConfigExists();

  if (configExists instanceof ExtendedError) {
    await configService.initConfig();

    const setupConfig = await confirm({
      message: 'Would you like to setup your configuration?',
      default: true,
    });

    if (setupConfig === false) {
      console.log('Configuration setup cancelled.');
      process.exit(0);
    }
  }

  const llmPromptsLocalization = await select({
    message: 'Select llm prompts localization',
    choices: [
      {
        name: 'English',
        value: 'en',
      },
      {
        name: 'Russian',
        value: 'ru',
      },
    ],
  });

  await configService.setValueToKey(
    'llmPromptsLocalization',
    llmPromptsLocalization,
  );

  const aiCompletionModel = await input({
    message: 'Enter AI completion model',
    validate: (input) => {
      if (!input) {
        return 'Please enter a model';
      }
      return true;
    },
  });

  await configService.setValueToKey('aiCompletionModel', aiCompletionModel);
}
