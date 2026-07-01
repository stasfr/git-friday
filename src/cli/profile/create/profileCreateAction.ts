import { text, isCancel } from '@clack/prompts';

import { ProfileService } from '@/cli/profile/profileService.js';
import { ProfileRegistryService } from '@/cli/profile/ProfileRegistryService.js';

export async function profileCreateAction() {
  const profileName = await text({
    message: 'Enter profile name:',
    validate: (value) => {
      if (!value || value.trim() === '') {
        return 'Profile name is required';
      }
      return undefined;
    },
  });

  if (isCancel(profileName)) {
    console.log('Operation cancelled');
    process.exit(0);
  }

  const profileRegistryService = new ProfileRegistryService();
  const profileExists = await profileRegistryService.hasProfile(profileName);

  if (profileExists) {
    console.log(`Profile "${profileName}" already exists.`);
    return;
  }

  const profileService = new ProfileService({ profileName });
  await profileRegistryService.createProfileDir(profileName);
  await profileService.initConfig();
  await profileService.initPrompts();

  console.log(`Profile "${profileName}" created successfully.`);
  console.log('Now you can run "friday profile setup" to configure profile');
}
