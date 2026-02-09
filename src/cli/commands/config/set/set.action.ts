import { ConfigService } from '@/cli/commands/config/config.service.js';

import type { ConfigSetCommandOption } from '@/cli/commands/config/set/set.types.js';

export async function configSetAction(options: ConfigSetCommandOption) {
  try {
    const configService = new ConfigService();
    await configService.setValueToKey(options.key, options.value);
  } catch (error) {
    console.error('Failed to set configuration:', error);
  }
}
