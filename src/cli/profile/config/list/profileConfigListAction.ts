import { ProfileService } from '@/cli/profile/profileService.js';

import type { ProfileConfigListCommandOption } from '@/cli/profile/config/list/profileConfigListCommand.js';

export async function profileConfigListAction(
  options: ProfileConfigListCommandOption,
) {
  const { profileName } = options;

  const profileService = new ProfileService({ profileName });
  const config = await profileService.getRawProfileConfig();

  console.log('Current profile configuration:');
  console.log(config);
}
