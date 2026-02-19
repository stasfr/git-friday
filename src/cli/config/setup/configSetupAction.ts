import { select, input } from '@inquirer/prompts';

import { $l } from '@/localization/localization.js';
import { ConfigService } from '@/cli/config/configService.js';

export async function configSetupAction() {
  const configService = new ConfigService();

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
