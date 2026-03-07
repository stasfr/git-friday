import { select, isCancel } from '@clack/prompts';

import { firstLetterUpperCase } from '@/utils/stringUtils.js';
import { profileNameSelect } from '@/ui/profileNameSelect.js';

import { ProfileService } from '@/cli/profile/profileService.js';

import type { ProfilePromptReadCommandOption } from '@/cli/profile/prompt/read/profilePromptReadCommand.js';

type IPromptType = 'system' | 'user';

export async function profilePromptReadAction(
  options: ProfilePromptReadCommandOption,
) {
  let promptType: IPromptType;
  if (options.system) {
    promptType = 'system';
  } else if (options.user) {
    promptType = 'user';
  } else {
    const selectedPromptType = await select({
      message: 'Which prompt would you like to read?',
      options: [
        { label: 'System Prompt', value: 'system' },
        { label: 'User Prompt', value: 'user' },
      ],
    });

    if (isCancel(selectedPromptType)) {
      console.log('Operation cancelled');
      process.exit(0);
    }

    promptType = selectedPromptType;
  }

  const profileName = await profileNameSelect({
    profile: options.profile,
    command: 'profile prompt read',
  });

  const profileService = new ProfileService({ profileName });

  if (promptType === 'system') {
    await profileService.checkIfSystemPromptExists();
  } else {
    await profileService.checkIfUserPromptExists();
  }

  let prompt = 'Not found';

  if (promptType === 'system') {
    prompt = await profileService.getProfileSystemPrompt();
  } else if (promptType === 'user') {
    prompt = await profileService.getProfileUserPrompt();
  }

  console.log(
    `${firstLetterUpperCase(promptType)} prompt for profile "${profileName}"`,
  );
  console.log('\n' + prompt + '\n');
}
