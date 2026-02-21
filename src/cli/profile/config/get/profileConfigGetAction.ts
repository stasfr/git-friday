import { ExtendedError } from '@/errors/ExtendedError.js';
import { ProfileService } from '@/cli/profile/profileService.js';

import type { ProfileConfigGetCommandOption } from '@/cli/profile/config/get/profileConfigGetCommand.js';

export async function profileConfigGetAction(
  options: ProfileConfigGetCommandOption,
) {
  const { profileName, key } = options;

  if (key !== 'gitLogCommand' && key !== 'aiCompletionModel') {
    throw new ExtendedError({
      layer: 'CommandExecutionError',
      message: 'Invalid config key',
      command: 'profile config get',
      service: null,
      hint: 'Supported keys: gitLogCommand, aiCompletionModel',
    });
  }

  const profileService = new ProfileService({ profileName });
  const value = await profileService.getValueFromKey(key);
  console.log(`${key}: ${value}`);
}
