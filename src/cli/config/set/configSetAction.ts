import { ConfigService } from '@/cli/config/configService.js';

import type { ConfigSetCommandOption } from '@/cli/config/set/configSetCommand.js';

export async function configSetAction(options: ConfigSetCommandOption) {
  if (
    options.key === 'llmPromptsLocalization' &&
    (typeof options.value !== 'string' || !['en', 'ru'].includes(options.value))
  ) {
    throw new Error(
      'Invalid llmPromptsLocalization value. Supported values: en, ru',
    );
  }

  if (
    options.key === 'aiCompletionModel' &&
    (typeof options.value !== 'string' ||
      isNaN(Number(options.value)) === false)
  ) {
    throw new Error('Invalid aiCompletionModel value');
  }

  const configService = new ConfigService();
  await configService.setValueToKey(options.key, options.value);
}
