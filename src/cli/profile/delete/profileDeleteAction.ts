import { confirm, isCancel } from '@clack/prompts';

import { profileNameSelect } from '@/ui/profileNameSelect.js';

import { ProfileRegistryService } from '@/cli/profile/ProfileRegistryService.js';

import type { ProfileDeleteOptions } from '@/cli/profile/delete/profileDeleteCommand.js';

export async function profileDeleteAction(options: ProfileDeleteOptions) {
  const profileName = await profileNameSelect({
    profile: options.profile,
  });

  const isConfirmed = await confirm({
    message: `Are you sure you want to delete profile "${profileName}"? This action cannot be undone.`,
    initialValue: false,
  });

  if (isCancel(isConfirmed)) {
    console.log('Operation cancelled');
    process.exit(0);
  }

  if (!isConfirmed) {
    console.log('Profile deletion cancelled.');
    return;
  }

  const profileRegistryService = new ProfileRegistryService();
  await profileRegistryService.deleteProfile(profileName);

  console.log(`Profile "${profileName}" deleted successfully.`);
}
