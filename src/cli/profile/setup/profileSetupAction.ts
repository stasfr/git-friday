import { text, confirm, isCancel } from '@clack/prompts';

import { aiCompletionModelSelect } from '@/ui/aiCompletionModelSelect.js';
import { profileNameSelect } from '@/ui/profileNameSelect.js';

import { ProfileService } from '@/cli/profile/profileService.js';

import type { ProfileSetupCommandOption } from '@/cli/profile/setup/profileSetupCommand.js';

export async function profileSetupAction(options: ProfileSetupCommandOption) {
  const profileName = await profileNameSelect({
    profile: options.profile,
  });

  const profileService = new ProfileService({ profileName });

  await profileService.checkIfProfileConfigExists();

  const setupGitLog = await confirm({
    message: 'Would you like to set a preset git log command?',
    initialValue: false,
  });

  if (isCancel(setupGitLog)) {
    console.log('Operation cancelled');
    process.exit(0);
  }

  if (setupGitLog === true) {
    const gitLogCommand = await text({
      message: 'Enter custom git log command',
      validate: (input) => {
        if (!input) {
          return 'Please enter a command or cancel';
        }
        return undefined;
      },
    });

    if (isCancel(gitLogCommand)) {
      console.log('Operation cancelled');
      process.exit(0);
    }

    await profileService.setValueToKey('gitLogCommand', gitLogCommand);
  }

  const aiCompletionModel = await aiCompletionModelSelect();

  await profileService.setValueToKey('aiCompletionModel', aiCompletionModel);

  console.log(`Profile "${profileName}" configuration completed successfully.`);
}
