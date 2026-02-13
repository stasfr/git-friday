import { $l } from '@/localization/localization.js';
import { ConfigService } from '@/cli/config/configService.js';

import type { ConfigSetCommandOption } from '@/cli/config/set/configSetCommand.js';

export async function configSetAction(options: ConfigSetCommandOption) {
  if (
    options.key === 'appLocalization' &&
    (typeof options.value !== 'string' || !['en', 'ru'].includes(options.value))
  ) {
    throw new Error($l('invalidAppLocalizationValue'));
  }

  if (
    options.key === 'aiCompletionModel' &&
    (typeof options.value !== 'string' ||
      isNaN(Number(options.value)) === false)
  ) {
    throw new Error($l('invalidAiCompletionModelValue'));
  }

  const configService = new ConfigService();
  await configService.setValueToKey(options.key, options.value);
}
