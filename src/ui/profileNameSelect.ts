import { select } from '@inquirer/prompts';

import { ProfileRegistryService } from '@/cli/profile/ProfileRegistryService.js';
import { NotFoundError, CommandExecutionError } from '@/errors/Errors.js';

interface ProfileNameSelectOptions {
  profile: string | undefined;
  command: string;
}

export async function profileNameSelect(options: ProfileNameSelectOptions) {
  let profileName = options.profile;
  const profileRegistryService = new ProfileRegistryService();

  if (!profileName) {
    const profiles = await profileRegistryService.listAllProfiles();

    if (profiles.length === 0) {
      throw new CommandExecutionError({
        message: 'No profiles found',
        hint: 'Create a profile first using "friday profile create" command',
      });
    }

    profileName = await select({
      message: 'Select a profile:',
      choices: profiles.map((name) => ({
        name,
        value: name,
      })),
    });

    if (typeof profileName !== 'string' || profileName.length === 0) {
      throw new CommandExecutionError({
        message: 'Invalid profile selection',
        hint: 'Please select a valid profile from the list',
      });
    }
  } else {
    const profileExists = await profileRegistryService.hasProfile(profileName);
    if (!profileExists) {
      throw new NotFoundError({
        message: 'Profile does not exist',
        hint: 'Please create a profile first using "friday profile create" command',
      });
    }
  }

  return profileName;
}
