import { ExtendedError } from '@/errors/ExtendedError.js';
import { ProfileService } from '@/cli/profile/profileService.js';

import type { ProfileConfigListCommandOption } from '@/cli/profile/config/list/profileConfigListCommand.js';

export async function profileConfigListAction(
  options: ProfileConfigListCommandOption,
) {
  const { profileName } = options;

  const profileExists = await ProfileService.checkIfProfileExists(profileName);
  if (!profileExists) {
    throw new ExtendedError({
      layer: 'CommandExecutionError',
      message: 'Profile does not exist',
      command: 'profile config list',
      service: null,
      hint: 'Please create a profile first using "friday profile create" command',
    });
  }

  const profileService = new ProfileService({ profileName });
  const config = await profileService.getRawProfileConfig();

  console.log('Current profile configuration:');
  console.log(config);
}
