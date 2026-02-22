import { input } from '@inquirer/prompts';

import { ProfileService } from '@/cli/profile/profileService.js';

export async function profileCreateAction() {
  const profileName = await input({
    message: 'Enter profile name:',
    validate: (value) => {
      if (!value || value.trim() === '') {
        return 'Profile name is required';
      }
      return true;
    },
  });

  const profileExists = await ProfileService.checkIfProfileExists(profileName);

  if (profileExists) {
    console.log(`Profile "${profileName}" already exists.`);
    return;
  }

  const profileService = new ProfileService({ profileName });

  await profileService.initProfileWithConfig();

  console.log(`Profile "${profileName}" created successfully.`);
  console.log('Now you can run "friday profile setup" to configure profile');
}
