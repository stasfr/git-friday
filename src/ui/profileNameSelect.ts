import { select } from '@inquirer/prompts';

import { ProfileRegistryService } from '@/cli/profile/ProfileRegistryService.js';
import { ExtendedError } from '@/errors/ExtendedError.js';

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
      throw new ExtendedError({
        layer: 'CommandExecutionError',
        message: 'No profiles found',
        command: options.command,
        service: null,
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
      throw new ExtendedError({
        layer: 'CommandExecutionError',
        message: 'Invalid profile selection',
        command: options.command,
        service: null,
        hint: 'Please select a valid profile from the list',
      });
    }
  } else {
    const profileExists = await profileRegistryService.hasProfile(profileName);
    if (!profileExists) {
      throw new ExtendedError({
        layer: 'CommandExecutionError',
        message: 'Profile does not exist',
        command: options.command,
        service: null,
        hint: 'Please create a profile first using "friday profile create" command',
      });
    }
  }

  return profileName;
}
