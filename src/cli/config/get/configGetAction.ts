import { ExtendedError } from '@/errors/ExtendedError.js';
import { ConfigService } from '@/cli/config/configService.js';

import type { ConfigGetCommandOption } from '@/cli/config/get/configGetCommand.js';

export async function configGetAction(options: ConfigGetCommandOption) {
  if (
    options.key !== 'aiCompletionModel' &&
    options.key !== 'llmPromptsLocalization'
  ) {
    throw new ExtendedError({
      layer: 'CommandExecutionError',
      message: 'Invalid config key',
      command: 'config get',
      service: null,
      hint: 'Supported keys: aiCompletionModel, llmPromptsLocalization',
    });
  }

  const configService = new ConfigService();
  const value = await configService.getValueFromKey(options.key);
  console.log(`${options.key}: ${value}`);
}
