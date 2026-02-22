import { input, confirm } from '@inquirer/prompts';

import { aiCompletionModelSelect } from '@/ui/aiCompletionModelSelect.js';
import { ExtendedError } from '@/errors/ExtendedError.js';
import { profileNameSelect } from '@/ui/profileNameSelect.js';

import { ProfileService } from '@/cli/profile/profileService.js';

import type { ProfileSetupCommandOption } from '@/cli/profile/setup/profileSetupCommand.js';

export async function profileSetupAction(options: ProfileSetupCommandOption) {
  const profileName = await profileNameSelect({
    profile: options.profile,
    command: 'profile setup',
  });

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

  const aiCompletionModel = await aiCompletionModelSelect();

  await profileService.setValueToKey('aiCompletionModel', aiCompletionModel);

  console.log(`Profile "${profileName}" configuration completed successfully.`);
}
