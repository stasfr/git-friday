import { profileNameSelect } from '@/ui/profileNameSelect.js';
import { ProfileService } from '@/cli/profile/profileService.js';

import type { ProfileConfigListCommandOption } from '@/cli/profile/config/list/profileConfigListCommand.js';

export async function profileConfigListAction(
  options: ProfileConfigListCommandOption,
) {
  const profileName = await profileNameSelect({
    profile: options.profile,
    command: 'profile config list',
  });

  const profileService = new ProfileService({ profileName });
  const config = await profileService.getRawProfileConfig();

  console.log(`Current profile "${profileName}" configuration:`);
  console.log(config);
}
