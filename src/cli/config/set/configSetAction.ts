import { ExtendedError } from '@/errors/ExtendedError.js';
import { ConfigService } from '@/cli/config/configService.js';

import type { ConfigSetCommandOption } from '@/cli/config/set/configSetCommand.js';

export async function configSetAction(options: ConfigSetCommandOption) {
  if (
    options.key === 'llmPromptsLocalization' &&
    (typeof options.value !== 'string' || !['en', 'ru'].includes(options.value))
  ) {
    throw new ExtendedError({
      layer: 'CommandExecutionError',
      message: 'Invalid llmPromptsLocalization value',
      command: 'config set llmPromptsLocalization',
      service: null,
      hint: 'Supported values: en, ru',
    });
  }

  if (
    options.key === 'aiCompletionModel' &&
    (typeof options.value !== 'string' ||
      isNaN(Number(options.value)) === false)
  ) {
    throw new ExtendedError({
      layer: 'CommandExecutionError',
      message: 'Invalid aiCompletionModel value',
      command: 'config set aiCompletionModel',
      service: null,
      hint: 'Model name must be a string',
    });
  }

  const configService = new ConfigService();
  await configService.setValueToKey(options.key, options.value);
}
