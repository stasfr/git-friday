import { select, confirm } from '@inquirer/prompts';

import { ExtendedError } from '@/errors/ExtendedError.js';
import { ProfileService } from '@/cli/profile/profileService.js';

interface IProfileDeleteOptions {
  profile?: string;
}

export async function profileDeleteAction(options: IProfileDeleteOptions) {
  let profileName = options.profile;

  if (!profileName) {
    const profiles = await ProfileService.listAllProfiles();

    if (profiles.length === 0) {
      throw new ExtendedError({
        layer: 'CommandExecutionError',
        message: 'No profiles found',
        command: 'profile delete',
        service: null,
        hint: 'Create a profile first using "friday profile create" command',
      });
    }

    profileName = await select({
      message: 'Select a profile to delete:',
      choices: profiles.map((profile) => ({
        name: profile,
        value: profile,
      })),
    });
  } else {
    const profileExists =
      await ProfileService.checkIfProfileExists(profileName);
    if (!profileExists) {
      throw new ExtendedError({
        layer: 'CommandExecutionError',
        message: 'Profile does not exist',
        command: 'profile delete',
        service: null,
        hint: 'Please create a profile first using "friday profile create" command',
      });
    }
  }

  const isConfirmed = await confirm({
    message: `Are you sure you want to delete profile "${profileName}"? This action cannot be undone.`,
    default: false,
  });

  if (!isConfirmed) {
    console.log('Profile deletion cancelled.');
    return;
  }

  const profileService = new ProfileService({ profileName });
  await profileService.deleteProfile();

  console.log(`Profile "${profileName}" deleted successfully.`);
}
