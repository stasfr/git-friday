import { input, confirm } from '@inquirer/prompts';

import { ExtendedError } from '@/errors/ExtendedError.js';
import { ProfileService } from '@/cli/profile/profileService.js';

import type { ProfileConfigSetupCommandOption } from '@/cli/profile/config/setup/profileConfigSetupCommand.js';

export async function profileConfigSetupAction(
  options: ProfileConfigSetupCommandOption,
) {
  const { profileName } = options;
  const profileService = new ProfileService({ profileName });

  const configExists = await profileService.checkIfProfileConfigExists();

  if (configExists instanceof ExtendedError) {
    const createProfile = await confirm({
      message: `Profile "${profileName}" does not exist. Would you like to create it?`,
      default: true,
    });

    if (createProfile === false) {
      console.log('Profile creation cancelled.');
      process.exit(0);
    }

    await profileService.initProfileWithConfig();

    const setupConfig = await confirm({
      message: `Would you like to setup profile "${profileName}" configuration?`,
      default: true,
    });

    if (setupConfig === false) {
      console.log('Profile configuration setup cancelled.');
      process.exit(0);
    }
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
