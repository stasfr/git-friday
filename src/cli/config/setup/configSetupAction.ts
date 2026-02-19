import { select, input, confirm } from '@inquirer/prompts';

import { $l } from '@/localization/localization.js';
import { ConfigService } from '@/cli/config/configService.js';

export async function configSetupAction() {
  const configService = new ConfigService();

  const configExists = await configService.checkIfConfigExists();

  if (!configExists) {
    configService.initConfig();

    const setupConfig = await confirm({
      message: 'Would you like to setup your configuration?',
      default: true,
    });

    if (!setupConfig) {
      console.log('Configuration setup cancelled.');
      process.exit(0);
    }
  }

  const appLocalization = await select({
    message: $l('configSetupSelectLocalization'),
    choices: [
      {
        name: $l('configSetupEnglishOption'),
        value: 'en',
      },
      {
        name: $l('configSetupRussianOption'),
        value: 'ru',
      },
    ],
  });

  await configService.setValueToKey('appLocalization', appLocalization);

  const aiCompletionModel = await input({
    message: $l('configSetupEnterAiModel'),
    validate: (input) => {
      if (!input) {
        return $l('configSetupPleaseEnterModel');
      }
      return true;
    },
  });

  await configService.setValueToKey('aiCompletionModel', aiCompletionModel);
}
