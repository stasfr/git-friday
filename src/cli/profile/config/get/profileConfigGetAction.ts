import { profileNameSelect } from '@/ui/profileNameSelect.js';
import { profileConfigKeySelect } from '@/ui/profileConfigKeySelect.js';
import { ProfileService } from '@/cli/profile/profileService.js';

import type { ProfileConfigGetCommandOption } from '@/cli/profile/config/get/profileConfigGetCommand.js';

export async function profileConfigGetAction(
  options: ProfileConfigGetCommandOption,
) {
  const profileName = await profileNameSelect({
    profile: options.profile,
    command: 'profile config get',
  });

  const selectedKey = await profileConfigKeySelect({
    key: options.key,
    command: 'profile config get',
  });

  const profileService = new ProfileService({ profileName });
  const value = await profileService.getValueFromKey(selectedKey);
  console.log(`${selectedKey}: ${value}`);
}
