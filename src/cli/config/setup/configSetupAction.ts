import { select, input } from '@inquirer/prompts';

import { $l } from '@/localization/localization.js';
import { ConfigService } from '@/cli/config/configService.js';

export async function configSetupAction() {
  const configService = new ConfigService();

  const appLocalization = await select({
    message: 'Select app localization',
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

  await configService.setValueToKey('appLocalization', appLocalization);

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
