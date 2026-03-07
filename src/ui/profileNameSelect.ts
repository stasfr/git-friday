import { select, isCancel } from '@clack/prompts';

import { ProfileRegistryService } from '@/cli/profile/ProfileRegistryService.js';
import { NotFoundError, CommandExecutionError } from '@/errors/Errors.js';

interface ProfileNameSelectOptions {
  profile: string | undefined;
  command: string;
}

export async function profileNameSelect(options: ProfileNameSelectOptions) {
  const profileRegistryService = new ProfileRegistryService();
  let profileName: string;

  if (!options.profile) {
    const profiles = await profileRegistryService.listAllProfiles();

    if (profiles.length === 0) {
      throw new CommandExecutionError({
        message: 'No profiles found',
        hint: 'Create a profile first using "friday profile create" command',
      });
    }

    const selectedProfile = await select({
      message: 'Select a profile:',
      options: profiles.map((name) => ({
        name,
        value: name,
      })),
    });

    if (isCancel(selectedProfile)) {
      console.log('Operation cancelled');
      process.exit(0);
    }

    if (typeof selectedProfile !== 'string' || selectedProfile.length === 0) {
      throw new CommandExecutionError({
        message: 'Invalid profile selection',
        hint: 'Please select a valid profile from the list',
      });
    }

    profileName = selectedProfile;
  } else {
    const profileExists = await profileRegistryService.hasProfile(
      options.profile,
    );

    if (!profileExists) {
      throw new NotFoundError({
        message: 'Profile does not exist',
        hint: 'Please create a profile first using "friday profile create" command',
      });
    }

    profileName = options.profile;
  }

  return profileName;
}
