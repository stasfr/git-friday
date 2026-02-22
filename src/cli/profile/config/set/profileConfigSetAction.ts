import { ProfileService } from '@/cli/profile/profileService.js';
import { ExtendedError } from '@/errors/ExtendedError.js';

import type { ProfileConfigSetCommandOption } from '@/cli/profile/config/set/profileConfigSetCommand.js';

export async function profileConfigSetAction(
  options: ProfileConfigSetCommandOption,
) {
  const { profileName, key, value } = options;

  const profileExists = await ProfileService.checkIfProfileExists(profileName);
  if (!profileExists) {
    throw new ExtendedError({
      layer: 'CommandExecutionError',
      message: 'Profile does not exist',
      command: 'profile config set',
      service: null,
      hint: 'Please create a profile first using "friday profile create" command',
    });
  }

  if (
    key === 'gitLogCommand' &&
    (typeof value !== 'string' || isNaN(Number(value)) === false)
  ) {
    throw new ExtendedError({
      layer: 'CommandExecutionError',
      message: 'Invalid gitLogCommand value',
      command: null,
      service: null,
      hint: null,
    });
  }

  if (
    key === 'aiCompletionModel' &&
    (typeof value !== 'string' || isNaN(Number(value)) === false)
  ) {
    throw new ExtendedError({
      layer: 'CommandExecutionError',
      message: 'Invalid aiCompletionModel value',
      command: 'config set aiCompletionModel',
      service: null,
      hint: 'Model name must be a string',
    });
  }

  const profileService = new ProfileService({ profileName });
  await profileService.setValueToKey(key, value);
}
