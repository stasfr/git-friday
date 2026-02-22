import { input, confirm, select } from '@inquirer/prompts';

import { ExtendedError } from '@/errors/ExtendedError.js';
import { ProfileService } from '@/cli/profile/profileService.js';

import type { ProfileSetupCommandOption } from '@/cli/profile/setup/profileSetupCommand.js';

export async function profileSetupAction(options: ProfileSetupCommandOption) {
  let profileName = options.profile;

  if (!profileName) {
    const profiles = await ProfileService.listAllProfiles();

    if (profiles.length === 0) {
      throw new ExtendedError({
        layer: 'CommandExecutionError',
        message: 'No profiles found',
        command: 'profile setup',
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
        command: 'profile setup',
        service: null,
        hint: 'Please select a valid profile from the list',
      });
    }
  } else {
    const profileExists =
      await ProfileService.checkIfProfileExists(profileName);
    if (!profileExists) {
      throw new ExtendedError({
        layer: 'CommandExecutionError',
        message: 'Profile does not exist',
        command: 'profile setup',
        service: null,
        hint: 'Please create a profile first using "friday profile create" command',
      });
    }
  }

  const profileService = new ProfileService({ profileName });

  const configExists = await profileService.checkIfProfileConfigExists();

  if (configExists instanceof ExtendedError) {
    throw configExists;
  }

  const setupGitLog = await confirm({
    message: 'Would you like to set a preset git log command?',
    default: false,
  });

  if (setupGitLog) {
    const gitLogCommand = await input({
      message: 'Enter custom git log command',
      validate: (input) => {
        if (!input) {
          return 'Please enter a command or cancel';
        }
        return true;
      },
    });

    await profileService.setValueToKey('gitLogCommand', gitLogCommand);
  }

  const aiCompletionModel = await input({
    message: 'Enter AI completion model',
    validate: (input) => {
      if (!input) {
        return 'Please enter a model';
      }
      return true;
    },
  });

  await profileService.setValueToKey('aiCompletionModel', aiCompletionModel);

  console.log(`Profile "${profileName}" configuration completed successfully.`);
}
