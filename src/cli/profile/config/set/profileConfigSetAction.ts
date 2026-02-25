import { profileNameSelect } from '@/ui/profileNameSelect.js';
import { profileConfigKeySelect } from '@/ui/profileConfigKeySelect.js';
import { profileConfigSetInput } from '@/ui/profileConfigSetInput.js';
import { ProfileService } from '@/cli/profile/profileService.js';

import type { ProfileConfigSetCommandOption } from '@/cli/profile/config/set/profileConfigSetCommand.js';

export async function profileConfigSetAction(
  options: ProfileConfigSetCommandOption,
) {
  const profileName = await profileNameSelect({
    profile: options.profile,
    command: 'profile config set',
  });

  const selectedKey = await profileConfigKeySelect({
    key: options.key,
    command: 'profile config set',
  });

  const value = await profileConfigSetInput({
    value: options.value,
    key: selectedKey,
    command: 'profile config set',
  });

  const profileService = new ProfileService({ profileName });
  await profileService.setValueToKey(selectedKey, value);
}
