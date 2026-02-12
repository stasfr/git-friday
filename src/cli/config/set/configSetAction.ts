import { ConfigService } from '@/cli/config/configService.js';

import type { ConfigSetCommandOption } from '@/cli/config/set/configSetCommand.js';

export async function configSetAction(options: ConfigSetCommandOption) {
  try {
    const configService = new ConfigService();
    await configService.setValueToKey(options.key, options.value);
  } catch (error) {
    console.error('Failed to set configuration:', error);
  }
}
